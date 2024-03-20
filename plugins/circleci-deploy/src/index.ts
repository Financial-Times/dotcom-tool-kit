import CircleCiConfigHook, {
  CircleCIStatePartial,
  generateConfigWithJob
} from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'
import { getOptions } from '@dotcom-tool-kit/options'
import { JobConfig } from '@dotcom-tool-kit/types/src/circleci'
import type { Logger } from 'winston'

const getServerlessAdditionalFields = (logger: Logger): JobConfig => {
  const serverlessOptions = getOptions('@dotcom-tool-kit/serverless')
  const herokuOptions = getOptions('@dotcom-tool-kit/heroku')

  if (serverlessOptions && herokuOptions) {
    logger.warn(
      'Tool Kit currently does not support managing Heroku and Serverless apps in the same project.'
    )
  }

  if (!serverlessOptions?.awsAccountId || !serverlessOptions?.systemCode) {
    return {}
  }

  return {
    'aws-account-id': serverlessOptions.awsAccountId,
    'system-code': serverlessOptions.systemCode
  }
}

abstract class DeployConfigHook extends CircleCiConfigHook {
  abstract job: string
  abstract requiredJobs: string[]
  abstract filters: JobConfig['filters']
  abstract addToNightly: boolean

  // needs to be a getter so that we can lazily wait for the global options
  // object to be assigned before getting values from it
  get config(): CircleCIStatePartial {
    // CircleCI config generator which will additionally optionally pass Serverless
    // options as parameters to the orb job to enable OIDC authentication
    const serverlessAdditionalsFields = getServerlessAdditionalFields(this.logger)

    return generateConfigWithJob({
      name: this.job,
      addToNightly: this.addToNightly,
      requires: this.requiredJobs,
      splitIntoMatrix: false,
      additionalFields: { ...serverlessAdditionalsFields, filters: this.filters }
    })
  }
}

export class DeployReview extends DeployConfigHook {
  job = 'tool-kit/deploy-review'
  requiredJobs = ['tool-kit/setup', 'waiting-for-approval']
  filters = { branches: { ignore: 'main' } }
  addToNightly = true
}

export class DeployStaging extends DeployConfigHook {
  job = 'tool-kit/deploy-staging'
  requiredJobs = ['tool-kit/setup']
  filters = { branches: { only: 'main' } }
  addToNightly = false
}

export class DeployProduction extends DeployConfigHook {
  job = 'tool-kit/deploy-production'
  requiredJobs = [new TestStaging(this.logger).job, TestCI.job]
  filters = { branches: { only: 'main' } }
  addToNightly = false
}

abstract class TestConfigHook extends CircleCiConfigHook {
  abstract job: string
  abstract requiredJobs: string[]

  get config() {
    const jobOptions = {
      name: this.job,
      requires: this.requiredJobs,
      addToNightly: false,
      splitIntoMatrix: false
    }

    // CircleCI config generator which will additionally optionally pass Serverless
    // options as parameters to the orb job to enable OIDC authentication
    const serverlessAdditionalsFields = getServerlessAdditionalFields(this.logger)

    const options = getOptions('@dotcom-tool-kit/circleci')
    if (options?.cypressImage) {
      return {
        executors: { cypress: { docker: [{ image: options.cypressImage }] } },
        ...generateConfigWithJob({
          ...jobOptions,
          additionalFields: { ...serverlessAdditionalsFields, executor: 'cypress' }
        })
      }
    }
    return generateConfigWithJob({ ...jobOptions, additionalFields: serverlessAdditionalsFields })
  }
}

export class TestReview extends TestConfigHook {
  job = 'tool-kit/e2e-test-review'
  requiredJobs = [new DeployReview(this.logger).job]
}

export class TestStaging extends TestConfigHook {
  job = 'tool-kit/e2e-test-staging'
  requiredJobs = [new DeployStaging(this.logger).job]
}

export const hooks = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'test:review': TestReview,
  'teardown:review': TestReview,
  'test:staging': TestStaging,
  'teardown:staging': TestStaging,
  'deploy:production': DeployProduction
}
