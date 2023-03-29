import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigHook, { generateConfigWithJob } from './circleci-config'

export class BuildCI extends CircleCiConfigHook {
  static job = 'tool-kit/build'
  config = generateConfigWithJob({ name: BuildCI.job, requires: ['tool-kit/setup'], addToNightly: true })
}

export class TestCI extends CircleCiConfigHook {
  static job = 'tool-kit/test'
  config = generateConfigWithJob({
    name: TestCI.job,
    requires: [BuildCI.job],
    addToNightly: true
  })
}

export const hooks = {
  'build:ci': BuildCI,
  'test:ci': TestCI
}

const envVars = {
  branch: process.env.CIRCLE_BRANCH,
  repo: process.env.CIRCLE_PROJECT_REPONAME,
  version: process.env.CIRCLE_SHA1,
  tag: process.env.CIRCLE_TAG
}

function pluginInit() {
  if (process.env.CIRCLECI) {
    /* eslint-disable-next-line no-console --
     * cannot use winston logging during module initialisation
     **/
    console.log(`writing circle ci environment variables to state...`)
    writeState('ci', envVars)
  }
}

pluginInit()
