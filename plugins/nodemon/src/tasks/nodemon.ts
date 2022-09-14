import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { NodemonOptions, NodemonSchema } from '@dotcom-tool-kit/types/lib/schema/nodemon'
import { writeState } from '@dotcom-tool-kit/state'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import getPort from 'get-port'
import nodemon from 'nodemon'
import { Readable } from 'stream'

export default class Nodemon extends Task<typeof NodemonSchema> {
  static description = ''

  static defaultOptions: NodemonOptions = {
    entry: './server/app.js',
    useVault: true
  }

  async run(): Promise<void> {
    const { entry, configPath, useVault } = this.options

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
        port: [3001, 3002, 3003]
      }))

    if (!entry) {
      const error = new ToolKitError(
        `the ${styles.task('Nodemon')} task requires an ${styles.option('entry')} option`
      )
      error.details = `this is the entrypoint for your app, e.g. ${styles.filepath('server/app.js')}`
      throw error
    }

    this.logger.verbose('starting the child nodemon process...')

    const env = {
      ...vaultEnv,
      PORT: port.toString(),
      ...process.env
    }
    nodemon({ script: entry, env, stdout: false, configFile: configPath })
    nodemon.on('readable', () => {
      // These fields aren't specified in the type declaration for some reason
      const { stdout, stderr } = (nodemon as unknown) as { stdout: Readable; stderr: Readable }
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
      nodemonLogger.log(nodemonToWinstonLogLevel(msg.type), msg.message)
    })
    await new Promise((resolve) => nodemon.on('start', resolve))
    writeState('local', { port })
  }
}
