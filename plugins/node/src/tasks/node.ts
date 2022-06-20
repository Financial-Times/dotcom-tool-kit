import { Task } from '@dotcom-tool-kit/types'
import { NodeOptions, NodeSchema } from '@dotcom-tool-kit/types/lib/schema/node'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { writeState } from '@dotcom-tool-kit/state'
import { hookConsole, hookFork, styles } from '@dotcom-tool-kit/logger'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class Node extends Task<typeof NodeSchema> {
  static description = ''

  static defaultOptions: NodeOptions = {
    entry: './server/app.js'
  }

  async run(): Promise<void> {
    const { entry, args } = this.options
    const vault = new VaultEnvVars(this.logger, {
      environment: 'development'
    })

    const vaultEnv = await vault.get()
    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: [3001, 3002, 3003]
      }))

    if (!entry) {
      const error = new ToolKitError(
        `the ${styles.task('Node')} task requires an ${styles.option('entry')} option`
      )
      error.details = `this is the entrypoint for your app, e.g. ${styles.filepath('server/app.js')}`
      throw error
    }

    this.logger.verbose('starting the child node process...')
    const child = fork(entry, args, {
      env: {
        ...vaultEnv,
        PORT: port.toString(),
        ...process.env
      },
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
