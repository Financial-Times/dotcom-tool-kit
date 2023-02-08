import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigHook, { generateConfigWithJob } from './circleci-config'

export class BuildCI extends CircleCiConfigHook {
  job = 'tool-kit/build'
  config = generateConfigWithJob({ name: this.job, requires: ['tool-kit/setup'], addToNightly: true })
}

export class TestCI extends CircleCiConfigHook {
  job = 'tool-kit/test'
  config = generateConfigWithJob({
    name: this.job,
    requires: [new BuildCI(this.logger).job],
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
    // cannot use winston logging during module initialisation
    // eslint-disable-next-line no-console
    console.log(`writing circle ci environment variables to state...`)
    writeState('ci', envVars)
  }
}

pluginInit()
