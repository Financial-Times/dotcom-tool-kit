import { spawn } from 'child_process'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/types'
import { CypressSchema } from '@dotcom-tool-kit/types/src/schema/cypress'

export class CypressLocal extends Task<typeof CypressSchema> {
  async run(): Promise<void> {
    const cypressEnv: Record<string, string> = {}
    if (this.options.localUrl) {
      cypressEnv.CYPRESS_BASE_URL = this.options.localUrl
    }

    const doppler = new DopplerEnvVars(this.logger, 'dev')
    const dopplerEnv = await doppler.get()

    const env = { ...process.env, ...dopplerEnv, ...cypressEnv }
    this.logger.info('running cypress' + (env.CYPRESS_BASE_URL ? ` against ${env.CYPRESS_BASE_URL}` : ''))
    const testProcess = spawn('cypress', ['run'], { env })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}

export class CypressCi extends Task<typeof CypressSchema> {
  async run(): Promise<void> {
    const reviewState = readState('review')
    const cypressEnv: Record<string, string> = {}
    if (reviewState && reviewState.appName) {
      cypressEnv.CYPRESS_BASE_URL = `https://${reviewState.appName}.herokuapp.com`
      cypressEnv.CYPRESS_REVIEW_APP = 'true'
    } else {
      cypressEnv.CYPRESS_BASE_URL = process.env.CYPRESS_CUSTOM_STAGING_URL || ''
    }

    this.logger.info(`running cypress against ${cypressEnv.CYPRESS_BASE_URL}`)
    const testProcess = spawn('cypress', ['run'], { env: { ...process.env, ...cypressEnv } })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}
