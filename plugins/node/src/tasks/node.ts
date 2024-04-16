import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import { writeState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { NodeSchema } from '@dotcom-tool-kit/schemas/lib/tasks/node'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { fork } from 'child_process'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class Node extends Task<{ task: typeof NodeSchema }> {
  static description = ''

  async run(): Promise<void> {
    const { entry, args, useDoppler, ports } = this.options

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(this.logger, 'dev')

      dopplerEnv = await doppler.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

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
