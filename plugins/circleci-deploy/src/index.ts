import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'
import { getOptions } from '@dotcom-tool-kit/options'
import type { JobConfig } from '@dotcom-tool-kit/types/src/circleci'

export class DeployReview extends CircleCiConfigHook {
  job = 'tool-kit/heroku-provision'
  jobOptions = {
    requires: ['tool-kit/setup', 'waiting-for-approval'],
    filters: { branches: { ignore: 'main' } }
  }
  addToNightly = true
}

export class DeployStaging extends CircleCiConfigHook {
  job = 'tool-kit/heroku-staging'
  jobOptions = { requires: ['tool-kit/setup'], filters: { branches: { only: 'main' } } }
}

abstract class CypressCiHook extends CircleCiConfigHook {
  abstract requiredJobs: string[]
  _jobOptions?: JobConfig

  get jobOptions(): JobConfig {
    if (!this._jobOptions) {
      const options = getOptions('@dotcom-tool-kit/circleci')
      this._jobOptions = {
        requires: this.requiredJobs
      }
      if (options?.cypressImage) {
        this.additionalFields = { executors: { cypress: { docker: [{ image: options.cypressImage }] } } }
        this._jobOptions.executor = 'cypress'
      }
    }
    return this._jobOptions
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
  jobOptions = {
    requires: [new TestStaging(this.logger).job, new TestCI(this.logger).job],
    filters: { branches: { only: 'main' } }
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
