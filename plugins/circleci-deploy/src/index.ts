import CircleCiConfigHook, {
  CircleCIStatePartial,
  generateConfigWithJob,
  JobGeneratorOptions
} from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'
import { getOptions } from '@dotcom-tool-kit/options'

// CircleCI config generator which will additionally optionally pass Serverless
// options as parameters to the orb job to enable OIDC authentication
const generateConfigWithServerlessOptions = (jobOptions: JobGeneratorOptions): CircleCIStatePartial => {
  const serverlessOptions = getOptions('@dotcom-tool-kit/serverless')
  if (serverlessOptions?.awsAccountId && serverlessOptions?.systemCode) {
    jobOptions.additionalFields ??= {}
    jobOptions.additionalFields['aws-account-id'] = serverlessOptions.awsAccountId
    jobOptions.additionalFields['system-code'] = serverlessOptions.systemCode
  }
  return generateConfigWithJob(jobOptions)
}

export class DeployReview extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-review'
  // needs to be a getter so that we can lazily wait for the global options
  // object to be assigned before getting values from it
  get config(): CircleCIStatePartial {
    return generateConfigWithServerlessOptions({
      name: DeployReview.job,
      addToNightly: true,
      requires: ['tool-kit/setup', 'waiting-for-approval'],
      additionalFields: {
        filters: { branches: { ignore: 'main' } }
      }
    })
  }
}

export class DeployStaging extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-staging'
  config = generateConfigWithJob({
    name: DeployStaging.job,
    addToNightly: false,
    requires: ['tool-kit/setup'],
    additionalFields: { filters: { branches: { only: 'main' } } }
  })
}

abstract class CypressCiHook extends CircleCiConfigHook {
  abstract job: string
  abstract requiredJobs: string[]

  get config() {
    const options = getOptions('@dotcom-tool-kit/circleci')
    const simplejobOptions = { name: this.job, addToNightly: false, requires: this.requiredJobs }
    if (options?.cypressImage) {
      return {
        executors: { cypress: { docker: [{ image: options.cypressImage }] } },
        ...generateConfigWithJob({ ...simplejobOptions, additionalFields: { executor: 'cypress' } })
      }
    } else {
      return generateConfigWithJob(simplejobOptions)
    }
  }
}

export class TestReview extends CypressCiHook {
  job = 'tool-kit/e2e-test-review'
  requiredJobs = [DeployReview.job]
}

export class TestStaging extends CypressCiHook {
  job = 'tool-kit/e2e-test-staging'
  requiredJobs = [DeployStaging.job]
}

export class DeployProduction extends CircleCiConfigHook {
  static job = 'tool-kit/deploy-production'
  get config(): CircleCIStatePartial {
    return generateConfigWithServerlessOptions({
      name: DeployProduction.job,
      addToNightly: false,
      requires: [new TestStaging(this.logger).job, TestCI.job],
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
  'test:staging': TestStaging,
  'teardown:staging': TestStaging,
  'deploy:production': DeployProduction
}
