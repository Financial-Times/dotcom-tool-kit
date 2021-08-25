import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'

class DeployReview extends CircleCiConfigHook {
  job = 'tool-kit/heroku-provision'
}

class DeployStaging extends CircleCiConfigHook {
  job = 'tool-kit/heroku-staging'
}

class DeployProduction extends CircleCiConfigHook {
  job = 'tool-kit/heroku-promote'
}

export const hooks = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'deploy:production': DeployProduction
}
