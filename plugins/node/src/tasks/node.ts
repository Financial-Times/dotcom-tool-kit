import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import { writeState } from '@dotcom-tool-kit/state'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { ChildProcess, fork } from 'child_process'
import getPort from 'get-port'
import waitPort from 'wait-port'
import path from 'path'
import * as z from 'zod'

const NodeSchema = z
  .object({
    entry: z.string().default('./server/app.js').describe('path to the node application'),
    args: z.string().array().optional().describe('additional arguments to pass to your application'),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('whether to run the application with environment variables from Doppler'),
    ports: z
      .union([z.number().array(), z.literal(false)])
      .default([3001, 3002, 3003])
      .describe(
        "ports to try to bind to for this application. set to `false` for an entry point that wouldn't bind to a port, such as a worker process or one-off script."
      ),
    watch: z
      .boolean()
      .optional()
      .describe(
        'run Node in watch mode, which restarts your application when the entrypoint or any imported files are changed. **nb** this option is experimental in versions of Node before v20.13.'
      )
  })
  .describe('Run a Node.js application for local development.')
export { NodeSchema as schema }

export default class Node extends Task<{ task: typeof NodeSchema }> {
  child?: ChildProcess

  async run({ cwd, config }: TaskRunContext): Promise<void> {
    const { entry, args, useDoppler, ports } = this.options

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(
        this.logger,
        'dev',
        config.pluginOptions['@dotcom-tool-kit/doppler']?.options
      )

      dopplerEnv = await doppler.get()
    }

    const execArgv = [...process.execArgv]

    if (this.options.watch) {
      execArgv.push('--watch')
    }

    const port = ports
      ? Number(process.env.PORT) ||
        (await getPort({
          port: ports
        }))
      : false

    this.logger.verbose('starting the child node process...')
    this.child = fork(path.resolve(cwd, entry), args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      execArgv,
      silent: true,
      cwd
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
  }

  async stop() {
    if (this.child && (this.child.exitCode === null || !this.child.killed)) {
      // SIGINT instead of SIGKILL so the process gets chance to exit gracefully
      this.child.kill('SIGINT')
    }
  }
}
