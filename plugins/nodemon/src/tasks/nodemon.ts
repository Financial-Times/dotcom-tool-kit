import { hookFork } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { NodemonSchema } from '@dotcom-tool-kit/types/lib/schema/nodemon'
import { writeState } from '@dotcom-tool-kit/state'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import getPort from 'get-port'
import nodemon from 'nodemon'
import { Readable } from 'stream'

export default class Nodemon extends Task<typeof NodemonSchema> {
  static description = ''

  async run(): Promise<void> {
    const { entry, command, configPath, useVault, ports, allowNativeFetch } = this.options

    let vaultEnv = {}

    if (useVault) {
      const vault = new VaultEnvVars(this.logger, {
        environment: 'development'
      })

      vaultEnv = await vault.get()
    }

    const port =
      Number(process.env.PORT) ||
      (await getPort({
        port: ports
      }))

    this.logger.verbose('starting the child nodemon process...')

    const env = {
      ...vaultEnv,
      PORT: port.toString(),
      ...process.env
    }
    const config: nodemon.Settings = { env, stdout: false, configFile: configPath }

    if (command) {
      config.exec = command
    } else {
      config.script = entry
    }

    // disable native fetch if supported by runtime
    if (!allowNativeFetch && process.allowedNodeEnvironmentFlags.has('--no-experimental-fetch')) {
      config.execMap = { js: 'node --no-experimental-fetch' }
    }
    nodemon(config)
    nodemon.on('readable', () => {
      // These fields aren't specified in the type declaration for some reason
      const { stdout, stderr } = (nodemon as unknown) as { stdout: Readable; stderr: Readable }
      const process = config.exec || config.command
      hookFork(this.logger, process, { stdout, stderr })
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
      nodemonLogger.log(nodemonToWinstonLogLevel(msg.type), msg.message)
    })
    await new Promise((resolve) => nodemon.on('start', resolve))
    writeState('local', { port })
  }
}
