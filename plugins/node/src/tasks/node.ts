import { hookConsole, hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { writeState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { NodeSchema } from '@dotcom-tool-kit/schemas/lib/tasks/node'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { ChildProcess, fork } from 'child_process'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class Node extends Task<{ task: typeof NodeSchema }> {
  child?: ChildProcess

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
    this.child = fork(entry, args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      silent: true
    })
    hookFork(this.logger, entry, this.child)

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

    await waitOnExit('node', this.child)
  }

  async stop() {
    if (this.child && (this.child.exitCode === null || !this.child.killed)) {
      // SIGINT instead of SIGKILL so the process gets chance to exit gracefully
      this.child.kill('SIGINT')
    }
  }
}
