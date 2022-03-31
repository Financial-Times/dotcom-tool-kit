import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { semVerRegex } from '@dotcom-tool-kit/npm/lib/tasks/npm-publish'

class PublishHook extends CircleCiConfigHook {
  job = 'tool-kit/publish'
  jobOptions = {
    context: 'npm-publish-token',
    requires: ['tool-kit/test'],
    filters: {
      branches: { ignore: '/.*/' },
      tags: { only: `${semVerRegex}` }
    }
  }
}

export const hooks = {
  'publish:tag': PublishHook
}
