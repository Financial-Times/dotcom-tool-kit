import { Task } from '@dotcom-tool-kit/task'
import { NodeOptions, NodeSchema } from '@dotcom-tool-kit/types/lib/schema/node'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'

export default class Node extends Task<typeof NodeSchema> {
  static description = ''

  static defaultOptions: NodeOptions = {
    entry: './server/app.js'
  }

  async run(): Promise<void> {
    const { entry } = this.options
    const vault = new VaultEnvVars({
      environment: 'development'
    })

    const vaultEnv = await vault.get()

    if (!entry) {
      const error = new ToolKitError('the Node tasks requires an `entry` option')
      error.details = 'this is the entrypoint for your app, e.g. `server/app.js`'
      throw error
    }

    const child = fork(
      entry,
      // TODO arguments?
      {
        env: {
          ...vaultEnv,
          ...process.env
          // TODO: PORT
        },
        stdio: 'inherit'
      }
    )

    // TODO wait for it to listen
  }
}
