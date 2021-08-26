import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigHook from './circleci-config'

export class BuildCI extends CircleCiConfigHook {
  job = 'tool-kit/build'
  jobOptions = { requires: ['tool-kit/setup', 'waiting-approval'] }
}

export class TestCI extends CircleCiConfigHook {
  job = 'tool-kit/test'
  jobOptions = { requires: [new BuildCI().job] }
}

export const hooks = {
  'build:ci': BuildCI,
  'test:ci': TestCI
}

const envVars = {
  branch: process.env.CIRCLE_BRANCH,
  repo: process.env.CIRCLE_PROJECT_REPONAME,
  version: process.env.CIRCLE_SHA1
}

function pluginInit() {
  if (process.env.CIRCLECI) {
    console.log(`writing circle ci environment variables to state...`)
    writeState('ci', envVars)
  }
}

pluginInit()
