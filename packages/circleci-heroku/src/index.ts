import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { TestCI } from '@dotcom-tool-kit/circleci/lib/index'

export class DeployReview extends CircleCiConfigHook {
  job = 'tool-kit/heroku-provision'
  jobOptions = {
    requires: ['tool-kit/setup'],
    filters: { branches: { only: '/(^renovate-.*|^nori/.*|^main)/' } }
  }
}

export class DeployStaging extends CircleCiConfigHook {
  job = 'tool-kit/heroku-staging'
  jobOptions = { requires: ['tool-kit/setup'], filters: { branches: { only: 'main' } } }
}

export class TestRemote extends CircleCiConfigHook {
  job = 'tool-kit/e2e-test'
  jobOptions = { requires: [new DeployReview().job, new DeployStaging().job] }
}

export class DeployProduction extends CircleCiConfigHook {
  job = 'tool-kit/heroku-promote'
  jobOptions = { requires: [new TestCI().job, new TestRemote().job] }
}

export const hooks = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'test:remote': TestRemote,
  'deploy:production': DeployProduction
}
