import CircleCiConfigHook from '@dotcom-tool-kit/circleci/lib/circleci-config'

class PublishHook extends CircleCiConfigHook {
  job = 'tool-kit/publish'
  jobOptions = {
    context: 'npm-publish-token',
    requires: ['tool-kit/test'],
    filters: {
      branches: { ignore: '/.*/' }
    }
  }
  runOnVersionTags = true
}

export const hooks = {
  'publish:tag': PublishHook
}
