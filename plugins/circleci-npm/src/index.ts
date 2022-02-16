import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'
import NpmPublish, { semVerRegex } from '@dotcom-tool-kit/npm/lib/tasks/npm-publish'

export const tasks = [
  NpmPublish
]

class PublishHook extends CircleCiConfigHook {
  job = 'tool-kit/publish'
  jobOptions = {
    requires: ['tool-kit/test'],
    filters: {
      branches: { ignore: '/.*/' },
      tags: { only: semVerRegex }
    }
  }
}

export const hooks = {
  'publish:tag': PublishHook
}


