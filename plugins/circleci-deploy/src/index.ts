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

export class DeployReview extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-review'
  // needs to be a getter so that we can lazily wait for the global options
  // object to be assigned before getting values from it
  get config(): CircleCIStatePartial {
    // CircleCI config generator which will additionally optionally pass Serverless
    // options as parameters to the orb job to enable OIDC authentication
    const serverlessAdditionalsFields = getServerlessAdditionalFields(this.logger)

    return generateConfigWithJob({
      name: DeployReview.job,
      addToNightly: true,
      requires: ['tool-kit/setup', 'waiting-for-approval'],
      splitIntoMatrix: false,
      skipOnRelease: true,
      additionalFields: { filters: { branches: { ignore: 'main' } }, ...serverlessAdditionalsFields }
    })
  }
}

export class DeployStaging extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-staging'
  get config(): CircleCIStatePartial {
    return generateConfigWithJob({
      name: DeployStaging.job,
      addToNightly: false,
      requires: ['tool-kit/setup'],
      splitIntoMatrix: false,
      skipOnRelease: true,
      additionalFields: { filters: { branches: { only: 'main' } } }
    })
  }
}

export class TestReview extends CircleCiConfigHook {
  static job = 'tool-kit/e2e-test-review'

  get config() {
    const jobOptions = {
      name: TestReview.job,
      requires: [DeployReview.job],
      addToNightly: false,
      splitIntoMatrix: false,
      skipOnRelease: true
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

export class TestStaging extends CircleCiConfigHook {
  static job = 'tool-kit/e2e-test-staging'

  get config() {
    const jobOptions = {
      name: TestStaging.job,
      requires: [DeployStaging.job],
      addToNightly: false,
      splitIntoMatrix: false,
      skipOnRelease: true
    }

    const options = getOptions('@dotcom-tool-kit/circleci')
    if (options?.cypressImage) {
      return {
        executors: { cypress: { docker: [{ image: options.cypressImage }] } },
        ...generateConfigWithJob({
          ...jobOptions,
          additionalFields: { executor: 'cypress' }
        })
      }
    }
    return generateConfigWithJob(jobOptions)
  }
}

export class DeployProduction extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-production'
  get config(): CircleCIStatePartial {
    // CircleCI config generator which will additionally optionally pass Serverless
    // options as parameters to the orb job to enable OIDC authentication
    const serverlessAdditionalsFields = getServerlessAdditionalFields(this.logger)

    return generateConfigWithJob({
      name: DeployProduction.job,
      addToNightly: false,
      requires: [TestStaging.job, TestCI.job],
      splitIntoMatrix: false,
      skipOnRelease: true,
      additionalFields: {
        ...serverlessAdditionalsFields,
        filters: { branches: { only: 'main' } }
      }
    })
  }
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
