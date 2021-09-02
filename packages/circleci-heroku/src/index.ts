import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'

export class DeployReview extends CircleCiConfigHook {
  job = 'tool-kit/heroku-provision'
  jobOptions = {
    requires: ['tool-kit/setup'],
    filters: { branches: { ignore: '/(^renovate-.*|^nori/.*|^main)/' } }
  }
}

export class DeployStaging extends CircleCiConfigHook {
  job = 'tool-kit/heroku-staging'
  jobOptions = { requires: ['tool-kit/setup'], filters: { branches: { only: 'main' } } }
}

export class TestReview extends CircleCiConfigHook {
  job = 'tool-kit/e2e-test-review'
  jobOptions = { requires: [new DeployReview().job] }
}

export class TestStaging extends CircleCiConfigHook {
  job = 'tool-kit/e2e-test-staging'
  jobOptions = { requires: [new DeployStaging().job] }
}

export class DeployProduction extends CircleCiConfigHook {
  job = 'tool-kit/heroku-promote'
  jobOptions = {
    requires: [new TestCI().job, new TestStaging().job],
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
