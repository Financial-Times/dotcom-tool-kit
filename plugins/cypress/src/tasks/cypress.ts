import { spawn } from 'child_process'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { CypressSchema } from '@dotcom-tool-kit/schemas/lib/tasks/cypress'

export default class Cypress extends Task<{ task: typeof CypressSchema }> {
  async run(): Promise<void> {
    const reviewState = readState('review')
    const appState = reviewState ?? readState('staging')
    const cypressEnv: Record<string, string> = {}
    let dopplerEnv = {}

    if (this.options.url) {
      cypressEnv.CYPRESS_BASE_URL = this.options.url
    }

    if (appState) {
      cypressEnv.CYPRESS_BASE_URL = appState.url ? appState.url : `https://${appState.appName}.herokuapp.com`

      if (reviewState) {
        cypressEnv.CYPRESS_REVIEW_APP = 'true'
      }
    } else {
      const doppler = new DopplerEnvVars(this.logger, 'dev')
      dopplerEnv = await doppler.get()
    }

    this.logger.info(
      'running cypress' + (cypressEnv.CYPRESS_BASE_URL ? ` against ${cypressEnv.CYPRESS_BASE_URL}` : '')
    )
    const testProcess = spawn('cypress', ['run'], { env: { ...process.env, ...dopplerEnv, ...cypressEnv } })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}
