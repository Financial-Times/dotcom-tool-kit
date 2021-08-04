import CircleCiConfigLifecycle from '@dotcom-tool-kit/circleci/lib/circleci-config'

class DeployReview extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle deploy:review'
  job = 'provision'
}

class DeployStaging extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle deploy:staging'
  job = 'deploy'
}

class DeployProduction extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle deploy:production'
  job = 'promote'
}

export const lifecycles = {
  'deploy:review': DeployReview,
  'deploy:staging': DeployStaging,
  'deploy:production': DeployProduction
}
