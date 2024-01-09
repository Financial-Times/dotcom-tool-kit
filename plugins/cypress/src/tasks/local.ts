import { spawn } from 'child_process'

import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { type CypressSchema } from '@dotcom-tool-kit/schemas/lib/plugins/cypress'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'

export default class CypressLocal extends Task<typeof CypressSchema> {
  async run(): Promise<void> {
    const cypressEnv: Record<string, string> = {}
    if (this.options.localUrl) {
      cypressEnv.CYPRESS_BASE_URL = this.options.localUrl
    }

    const vault = new VaultEnvVars(this.logger, {
      environment: 'development'
    })
    const vaultEnv = await vault.get()

    const env = { ...process.env, ...cypressEnv, ...vaultEnv }
    this.logger.info('running cypress' + (env.CYPRESS_BASE_URL ? ` against ${env.CYPRESS_BASE_URL}` : ''))
    const testProcess = spawn('cypress', ['run'], { env })
    hookFork(this.logger, 'cypress', testProcess)
    return waitOnExit('cypress', testProcess)
  }
}
