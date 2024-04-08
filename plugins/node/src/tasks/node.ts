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
    const { entry, args, useVault, ports } = this.options

    let vaultEnv = {}

    if (useVault) {
      const vault = new DopplerEnvVars(this.logger, 'dev')

      vaultEnv = await vault.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

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
