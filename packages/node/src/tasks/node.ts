import { Task } from '@dotcom-tool-kit/task'
import { NodeOptions, NodeSchema } from '@dotcom-tool-kit/types/lib/schema/node'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import getPort from 'get-port'
import waitPort from 'wait-port'

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
    const port =
      process.env.PORT ||
      (await getPort({
        port: [3001, 3002, 3003]
      }))

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
          PORT: port.toString(),
          ...process.env
        },
        stdio: 'inherit'
      }
    )

    await waitPort({
      host: 'localhost',
      port: Number(port)
    })
  }
}
