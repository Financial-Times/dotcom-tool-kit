import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigHook from './circleci-config'

class BuildCI extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit build:ci'
  job = 'build'
}

class TestCI extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit test:ci'
  job = 'test'
}

class TestRemote extends CircleCiConfigHook {
  script = 'npx dotcom-tool-kit test:remote'
  job = 'e2e-test'
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
