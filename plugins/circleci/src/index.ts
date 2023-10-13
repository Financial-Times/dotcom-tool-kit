import { writeState } from '@dotcom-tool-kit/state'

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
