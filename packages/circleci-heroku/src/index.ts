import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'

class DeployReview extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit deploy:review'
  job = 'provision'
}

class DeployStaging extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit deploy:staging'
  job = 'deploy'
}

class DeployProduction extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit deploy:production'
  job = 'promote'
}

export const hooks = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'deploy:production': DeployProduction
}
