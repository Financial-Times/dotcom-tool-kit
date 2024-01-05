import { type Readable } from 'stream'

import getPort from 'get-port'
import nodemon from 'nodemon'

import { hookFork } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { type NodemonSchema } from '@dotcom-tool-kit/schemas/lib/plugins/nodemon'
import { writeState } from '@dotcom-tool-kit/state'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { shouldDisableNativeFetch } from 'dotcom-tool-kit'

export default class Nodemon extends Task<typeof NodemonSchema> {
  static description = ''

  async run(): Promise<void> {
    const { entry, configPath, useVault, ports } = this.options

    let dopplerEnv = {}

    if (useVault) {
      const doppler = new DopplerEnvVars(this.logger, 'dev')

      dopplerEnv = await doppler.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

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
    writeState('local', { port })
  }
}
