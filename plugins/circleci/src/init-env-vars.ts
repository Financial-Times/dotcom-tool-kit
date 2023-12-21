import { writeState } from '@dotcom-tool-kit/state'
import { Init } from '@dotcom-tool-kit/types'

export default class CircleCIEnvVars extends Init {
  async init() {
    const envVars = {
      branch: process.env.CIRCLE_BRANCH,
      repo: process.env.CIRCLE_PROJECT_REPONAME,
      version: process.env.CIRCLE_SHA1,
      tag: process.env.CIRCLE_TAG
    }

    if (process.env.CIRCLECI) {
      this.logger.info(`writing circle ci environment variables to state...`)
      writeState('ci', envVars)
    }
  }
}
