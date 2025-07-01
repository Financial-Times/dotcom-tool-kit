import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import type ServerlessSchema from '../schema'
import { ChildProcess, spawn } from 'child_process'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { hookConsole, hookFork, waitOnExit, styles as s } from '@dotcom-tool-kit/logger'
import getPort from 'get-port'
import waitPort from 'wait-port'
import * as z from 'zod'
import { writeState } from '@dotcom-tool-kit/state'

const ServerlessRunSchema = z
  .object({
    ports: z
      .number()
      .array()
      .default([3001, 3002, 3003])
      .describe('ports to try to bind to for this application'),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('run the application with environment variables from Doppler'),
    background: z
      .boolean()
      .optional()
      .transform((background) => ({
        isDefault: typeof background === 'undefined',
        value: typeof background === 'undefined' ? true : background
      }))
      .default(true) // will never be reached because of the transform; here for the documentation generator's benefit
      .describe(
        "run the `serverless oflfine` process in the background, i.e. don't wait for it to exit before continuing to other Tool Kit tasks. set to `false` to wait for the process to exit, useful for running [multiple Tool Kit tasks in parallel](../parallel)."
      )
  })
  .describe('Run serverless functions locally')
export { ServerlessRunSchema as schema }

export default class ServerlessRun extends Task<{
  task: typeof ServerlessRunSchema
  plugin: typeof ServerlessSchema
}> {
  child?: ChildProcess

  async run({ cwd, config }: TaskRunContext): Promise<void> {
    const { useDoppler, ports } = this.options
    const { configPath } = this.pluginOptions

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(
        this.logger,
        'dev',
        config.pluginOptions['@dotcom-tool-kit/doppler']?.options
      )

      dopplerEnv = await doppler.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

    this.logger.verbose('starting the child serverless process...')
    const args = ['offline', 'start', '--host', 'local.ft.com', '--httpPort', `${port}`]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    this.child = spawn('serverless', args, {
      env: {
        ...dopplerEnv,
        PORT: port.toString(),
        ...process.env
      },
      cwd
    })

    hookFork(this.logger, 'serverless', this.child)

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

    if (this.options.background.isDefault) {
      this.logger.warn(
        `${s.task('ServerlessRun')} ${s.option(
          'options.background'
        )} is not set; falling back to the legacy behaviour of running the process in the background. This will be removed in a future major version of ${s.plugin(
          '@dotcom-tool-kit/serverless'
        )}.`
      )
    }

    if (!this.options.background.value) {
      await waitOnExit('serverless', this.child)
    }
  }

  async stop() {
    if (this.child && (this.child.exitCode === null || !this.child.killed)) {
      // SIGINT instead of SIGKILL so the process gets chance to exit gracefully
      this.child.kill('SIGINT')
    }
  }
}
