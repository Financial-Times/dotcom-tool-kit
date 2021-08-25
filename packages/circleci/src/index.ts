import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigHook from './circleci-config'

class BuildCI extends CircleCiConfigHook {
  job = 'tool-kit/build'
}

class TestCI extends CircleCiConfigHook {
  job = 'tool-kit/test'
}

class TestRemote extends CircleCiConfigHook {
  job = 'tool-kit/e2e-test'
}

export const hooks = {
  'build:ci': BuildCI,
  'test:ci': TestCI,
  'test:remote': TestRemote
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
