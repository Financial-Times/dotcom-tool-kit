import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { spawn } from 'child_process'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { hookConsole, hookFork } from '@dotcom-tool-kit/logger'
import getPort from 'get-port'
import waitPort from 'wait-port'

export default class ServerlessRun extends Task<typeof ServerlessSchema> {
  static description = 'Run serverless functions locally'

  async run(): Promise<void> {
    const { useVault, ports, configPath } = this.options

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

    this.logger.verbose('starting the child serverless process...')
    const args = ['offline', 'start', '--host', 'local.ft.com', '--httpPort', `${port}`]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args, {
      env: {
        ...vaultEnv,
        PORT: port.toString(),
        ...process.env
      }
    })

    hookFork(this.logger, 'serverless', child)

    const unhook = hookConsole(this.logger, 'wait-port')
    try {
      await waitPort({
        host: 'localhost',
        port: port
      })
    } finally {
      unhook()
    }
  }
}
