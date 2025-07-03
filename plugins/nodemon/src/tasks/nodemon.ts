import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { RootOptions } from '@dotcom-tool-kit/plugin/src/root-schema'
import { writeState } from '@dotcom-tool-kit/state'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import getPort from 'get-port'
import nodemon from 'nodemon'
import { Readable } from 'stream'
import { shouldDisableNativeFetch } from 'dotcom-tool-kit'
import * as z from 'zod/v3'

const NodemonSchema = z
  .object({
    entry: z.string().default('./server/app.js').describe('path to the node application'),
    configPath: z
      .string()
      .optional()
      .describe(
        "path to a Nodemon config file. defaults to Nodemon's [automatic config resolution](https://github.com/remy/nodemon#config-files)."
      ),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('whether to run the application with environment variables from Doppler'),
    ports: z
      .union([z.number().array(), z.literal(false)])
      .default([3001, 3002, 3003])
      .describe(
        "ports to try to bind to for this application. set to `false` for an entry point that wouldn't bind to a port, such as a worker process or one-off script."
      )
  })
  .describe('Run an application with `nodemon` for local development.')
export { NodemonSchema as schema }

export default class Nodemon extends Task<{ task: typeof NodemonSchema }> {
  async run({ config, cwd }: TaskRunContext): Promise<void> {
    const { entry, configPath, useDoppler, ports } = this.options

    if (cwd !== process.cwd()) {
      const error = new ToolKitError('the Nodemon task does not support monorepos')
      error.details = `Nodemon's support for running in specific directories changes the global environment, so it's not supported for use in monorepos. Use the ${styles.task(
        'Node'
      )} task with ${styles.code('watch: true')} instead.`
      throw error
    }

    let dopplerEnv = {}

    if (useDoppler) {
      const doppler = new DopplerEnvVars(
        this.logger,
        'dev',
        config.pluginOptions['@dotcom-tool-kit/doppler']?.options
      )

      dopplerEnv = await doppler.get()
    }

    const port = ports
      ? Number(process.env.PORT) ||
        (await getPort({
          port: ports
        }))
      : false

    this.logger.verbose('starting the child nodemon process...')

    const env = {
      ...dopplerEnv,
      PORT: port.toString(),
      ...process.env
    }
    const nodemonConfig: nodemon.Settings = { script: entry, env, stdout: false, configFile: configPath }
    // nodemon isn't forwarded process.execArgv so we need to pass the
    // --no-experimental-fetch flag explicitly the node process nodemon invokes
    if (shouldDisableNativeFetch(config.pluginOptions['app root'].options as RootOptions)) {
      nodemonConfig.execMap = { js: 'node --no-experimental-fetch' }
    }
    nodemon(nodemonConfig)
    nodemon.on('readable', () => {
      // These fields aren't specified in the type declaration for some reason
      const { stdout, stderr } = nodemon as unknown as { stdout: Readable; stderr: Readable }
      hookFork(this.logger, entry, { stdout, stderr })
    })
    const nodemonLogger = this.logger.child({ process: 'nodemon' })
    nodemon.on('log', (msg) => {
      function nodemonToWinstonLogLevel(level: string): string {
        switch (level) {
          case 'log':
            return 'debug'
          case 'info':
          case 'detail':
            return 'verbose'
          case 'fail':
          case 'error':
            return 'error'
          case 'status':
          default:
            return 'info'
        }
      }
      // need to manually add a newline seeing as we're acting as a subprocess
      nodemonLogger.log(nodemonToWinstonLogLevel(msg.type), msg.message + '\n')
    })
    await new Promise((resolve) => nodemon.on('start', resolve))

    if (port) writeState('local', { port })
  }
}
