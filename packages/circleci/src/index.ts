import { writeState } from '@dotcom-tool-kit/state'
import CircleCiConfigLifecycle from './circleci-config'

class BuildCI extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle build:ci'
  job = 'build'
}

class TestCI extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle test:ci'
  job = 'test'
}

class TestRemote extends CircleCiConfigLifecycle {
  script = 'npx dotcom-tool-kit lifecycle test:remote'
  job = 'e2e-test'
}

export const lifecycles = {
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
