import { Task } from '@dotcom-tool-kit/types'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { register } from 'ft-next-router'
import { readState } from '@dotcom-tool-kit/state'
import { hookConsole, hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { NextRouterSchema } from '@dotcom-tool-kit/types/lib/schema/next-router'

export default class NextRouter extends Task<typeof NextRouterSchema> {
  static description = ''

  async run(): Promise<void> {
    const vault = new VaultEnvVars(this.logger, {
      environment: 'development',
      vaultPath: {
        app: 'next-router',
        team: 'next'
      }
    })

    const routerBin = require.resolve('ft-next-router/bin/next-router')
    const vaultEnv = await vault.get()
    const child = fork(routerBin, ['--daemon'], {
      env: {
        ...process.env,
        ...vaultEnv
      },
      silent: true
    })
    hookFork(this.logger, 'next-router', child)
    await waitOnExit('next-router', child)

    const local = readState('local')
    if (!local) {
      const error = new ToolKitError('no locally running app found')
      error.details = `make sure there's a task running your app, e.g. via the ${styles.plugin(
        'node'
      )} plugin, configured to run before the ${styles.task('NextRouter')} task.`
      throw error
    }

    const unhook = hookConsole(this.logger, 'ft-next-router')
    try {
      await register({ service: this.options.appName, port: local.port })
    } finally {
      unhook()
    }
  }
}
