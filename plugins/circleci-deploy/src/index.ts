import CircleCiConfigHook, { generateConfigWithJob } from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'
import { getOptions } from '@dotcom-tool-kit/options'

export class DeployReview extends CircleCiConfigHook {
  job = 'tool-kit/heroku-provision'
  config = generateConfigWithJob({
    name: this.job,
    addToNightly: true,
    requires: ['tool-kit/setup', 'waiting-for-approval'],
    additionalFields: { filters: { branches: { ignore: 'main' } } }
  })
}

export class DeployStaging extends CircleCiConfigHook {
  job = 'tool-kit/heroku-staging'
  config = generateConfigWithJob({
    name: this.job,
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
  requiredJobs = [new DeployReview(this.logger).job]
}

export class TestStaging extends CypressCiHook {
  job = 'tool-kit/e2e-test-staging'
  requiredJobs = [new DeployStaging(this.logger).job]
}

export class DeployProduction extends CircleCiConfigHook {
  job = 'tool-kit/heroku-promote'
  config = generateConfigWithJob({
    name: this.job,
    addToNightly: false,
    requires: [new TestStaging(this.logger).job, new TestCI(this.logger).job],
    additionalFields: { filters: { branches: { only: 'main' } } }
  })
}

export const hooks = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'test:review': TestReview,
  'test:staging': TestStaging,
  'teardown:staging': TestStaging,
  'deploy:production': DeployProduction
}
