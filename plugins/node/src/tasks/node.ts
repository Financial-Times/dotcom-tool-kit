import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import { writeState } from '@dotcom-tool-kit/state'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { NodeSchema } from '@dotcom-tool-kit/schemas/lib/tasks/node'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { fork } from 'child_process'
import getPort from 'get-port'
import waitPort from 'wait-port'
import path from 'path'

export default class Node extends Task<{ task: typeof NodeSchema }> {
  async run({ cwd, config }: TaskRunContext): Promise<void> {
    const { entry, args, useDoppler, ports } = this.options

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(this.logger, 'dev', config.pluginOptions['@dotcom-tool-kit/doppler']?.options)

      dopplerEnv = await doppler.get()
    }

    const port = ports
      ? Number(process.env.PORT) ||
        (await getPort({
          port: ports
        }))
      : false

    this.logger.verbose('starting the child node process...')
    const child = fork(path.resolve(cwd, entry), args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      silent: true,
      cwd
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
