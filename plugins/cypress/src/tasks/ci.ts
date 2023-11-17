import { spawn } from 'child_process'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/types'
import { CypressSchema } from '@dotcom-tool-kit/types/lib/schema/plugins/cypress'

export default class CypressCi extends Task<typeof CypressSchema> {
  async run(): Promise<void> {
    const reviewState = readState('review')
    const cypressEnv: Record<string, string> = {}
    if (reviewState && reviewState.appName) {
      cypressEnv.CYPRESS_BASE_URL = `https://${reviewState.appName}.herokuapp.com`
      cypressEnv.CYPRESS_REVIEW_APP = 'true'
    } else {
      cypressEnv.CYPRESS_BASE_URL = `https://${process.env.CY_CUSTOM_DOMAIN_STAGING}`
    }

    this.logger.info(`running cypress against ${cypressEnv.CYPRESS_BASEURL}`)
    const testProcess = spawn('cypress', ['run'], { env: { ...process.env, ...cypressEnv } })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}
