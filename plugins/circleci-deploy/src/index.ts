import CircleCiConfigHook, {
  CircleCIStatePartial,
  generateConfigWithJob,
  JobGeneratorOptions
} from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'
import { getOptions } from '@dotcom-tool-kit/options'
import { JobConfig } from '@dotcom-tool-kit/types/src/circleci'
import type { Logger } from 'winston'

// CircleCI config generator which will additionally optionally pass Serverless
// options as parameters to the orb job to enable OIDC authentication
const generateConfigWithServerlessOptions = (
  logger: Logger,
  jobOptions: JobGeneratorOptions
): CircleCIStatePartial => {
  const serverlessOptions = getOptions('@dotcom-tool-kit/serverless')
  const herokuOptions = getOptions('@dotcom-tool-kit/heroku')
  if (serverlessOptions && herokuOptions) {
    logger.warn(
      'Tool Kit currently does not support managing Heroku and Serverless apps in the same project.'
    )
  }
  if (serverlessOptions?.awsAccountId && serverlessOptions?.systemCode) {
    jobOptions.additionalFields ??= {}
    jobOptions.additionalFields['aws-account-id'] = serverlessOptions.awsAccountId
    jobOptions.additionalFields['system-code'] = serverlessOptions.systemCode
  }
  return generateConfigWithJob(jobOptions)
}

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

const CYPRESS_JOB_OPTIONS = {
  addToNightly: false,
  splitIntoMatrix: false
}

export class DeployReview extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-review'
  // needs to be a getter so that we can lazily wait for the global options
  // object to be assigned before getting values from it
  get config(): CircleCIStatePartial {
    return generateConfigWithServerlessOptions(this.logger, {
      name: DeployReview.job,
      addToNightly: true,
      requires: ['tool-kit/setup', 'waiting-for-approval'],
      splitIntoMatrix: false,
      additionalFields: {
        filters: { branches: { ignore: 'main' } }
      }
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
      ...CYPRESS_JOB_OPTIONS
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
      name: TestReview.job,
      requires: [DeployStaging.job],
      ...CYPRESS_JOB_OPTIONS
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
    return generateConfigWithServerlessOptions(this.logger, {
      name: DeployProduction.job,
      addToNightly: false,
      requires: [TestStaging.job, TestCI.job],
      splitIntoMatrix: false,
      additionalFields: {
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
