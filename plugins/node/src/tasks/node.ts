import { Task } from '@dotcom-tool-kit/types'
import { NodeSchema } from '@dotcom-tool-kit/types/lib/schema/node'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { writeState } from '@dotcom-tool-kit/state'
import { hookConsole, hookFork, styles } from '@dotcom-tool-kit/logger'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class Node extends Task<typeof NodeSchema> {
  static description = ''

  async run(): Promise<void> {
    const { entry, args, useVault, ports, allowNativeFetch } = this.options

    let vaultEnv = {}

    if (useVault) {
      const vault = new VaultEnvVars(this.logger, {
        environment: 'development'
      })

      vaultEnv = await vault.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

    if (!entry) {
      const error = new ToolKitError(
        `the ${styles.task('Node')} task requires an ${styles.option('entry')} option`
      )
      error.details = `this is the entrypoint for your app, e.g. ${styles.filepath('server/app.js')}`
      throw error
    }

    let { execArgv } = process
    // disable native fetch if supported by runtime
    if (!allowNativeFetch && process.allowedNodeEnvironmentFlags.has('--no-experimental-fetch')) {
      execArgv = [...execArgv, '--no-experimental-fetch']
    }

    this.logger.verbose('starting the child node process...')
    const child = fork(entry, args, {
      env: {
        ...vaultEnv,
        PORT: port.toString(),
        ...process.env
      },
      execArgv,
      silent: true
    })
    hookFork(this.logger, entry, child)

    const unhook = hookConsole(this.logger, 'wait-port')
    try {
      await waitPort({
        host: 'localhost',
        port: port
      })
    } finally {
      unhook()
    }

    writeState('local', { port })
  }
}
