import { Task } from '@dotcom-tool-kit/task'
import { NodeOptions, NodeSchema } from '@dotcom-tool-kit/types/lib/schema/node'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'

export default class Node extends Task<typeof NodeSchema> {
  static description = ''

  static defaultOptions: NodeOptions = {
    entry: './server/app.js'
  }

  async run(): Promise<void> {
    const { entry } = this.options

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
          ...process.env
          // TODO: vault, PORT
        },
        stdio: 'inherit'
      }
    )

    // TODO wait for it to listen
  }
}
