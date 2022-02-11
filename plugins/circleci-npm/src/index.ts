import CircleCiNpm from './tasks/circleci-npm'
import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'

export const tasks = [
  CircleCiNpm
]

class PublishHook extends CircleCiConfigHook {
  job = 'tool-kit/publish'
  jobOptions = {
    requires: ['tool-kit/test'],
    filters: {
      branches: { ignore: '/.*/' },
      tags: { only: '/^v\\d+\\.\\d+\\.\\d+(-.+)?/' }
    }
  }
}

export const hooks = {
  'publish:ci': PublishHook
}


