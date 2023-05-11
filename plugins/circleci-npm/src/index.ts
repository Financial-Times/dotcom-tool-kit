import CircleCiConfigHook, { generateConfigWithJob } from '@dotcom-tool-kit/circleci/lib/circleci-config'

class PublishHook extends CircleCiConfigHook {
  static job = 'tool-kit/publish-tag'
  config = generateConfigWithJob({
    name: PublishHook.job,
    requires: ['tool-kit/test'],
    splitIntoMatrix: false,
    addToNightly: false,
    additionalFields: {
      context: 'npm-publish-token',
      filters: {
        branches: { ignore: '/.*/' }
      }
    }
  })
}

export const hooks = {
  'publish:tag': PublishHook
}
