import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import { writeState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { NodeSchema } from '@dotcom-tool-kit/schemas/tasks/node.js'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { fork } from 'child_process'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class Node extends Task<{ task: typeof NodeSchema }> {
  async run(): Promise<void> {
    const { entry, args, useDoppler, ports } = this.options

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(this.logger, 'dev')

      dopplerEnv = await doppler.get()
    }

    const port = ports
      ? Number(process.env.PORT) ||
        (await getPort({
          port: ports
        }))
      : false

    this.logger.verbose('starting the child node process...')
    const child = fork(entry, args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      silent: true
    })
    hookFork(this.logger, entry, child)

    if (port) {
      const unhook = hookConsole(this.logger, 'wait-port')
      try {
        await waitPort({
          host: 'localhost',
          port
        })
      } finally {
        unhook()
      }

      writeState('local', { port })
    }
  }
}
