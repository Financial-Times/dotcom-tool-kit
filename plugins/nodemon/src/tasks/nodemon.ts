import { hookFork } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { NodemonSchema } from '@dotcom-tool-kit/schemas/lib/tasks/nodemon'
import { writeState } from '@dotcom-tool-kit/state'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import getPort from 'get-port'
import nodemon from 'nodemon'
import { Readable } from 'stream'
import { shouldDisableNativeFetch } from 'dotcom-tool-kit'

export default class Nodemon extends Task<{ task: typeof NodemonSchema }> {
  async run(): Promise<void> {
    const { entry, configPath, useDoppler, ports } = this.options

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

    this.logger.verbose('starting the child nodemon process...')

    const env = {
      ...dopplerEnv,
      PORT: port.toString(),
      ...process.env
    }
    const config: nodemon.Settings = { script: entry, env, stdout: false, configFile: configPath }
    // nodemon isn't forwarded process.execArgv so we need to pass the
    // --no-experimental-fetch flag explicitly the node process nodemon invokes
    if (shouldDisableNativeFetch()) {
      config.execMap = { js: 'node --no-experimental-fetch' }
    }
    nodemon(config)
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
