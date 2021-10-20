import { Task } from '@dotcom-tool-kit/task'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { register } from 'ft-next-router'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { fork } from 'child_process'
import { NextRouterSchema } from '@dotcom-tool-kit/types/lib/schema/next-router'

export default class NextRouter extends Task<typeof NextRouterSchema> {
  static description = ''

  async run(): Promise<void> {
    if (!this.options.appName) {
      const error = new ToolKitError('your app name must be configured to use next-router')
      error.details = `this should be the same as its "name" field in next-service-registry. configure it in your .toolkitrc.yml, e.g.:

options:
  '@dotcom-tool-kit/next-router':
    appName: article`

      throw error
    }

    const vault = new VaultEnvVars({
      environment: 'development',
      vaultPath: {
        app: 'next-router',
        team: 'next'
      }
    })

    const routerBin = require.resolve('ft-next-router/bin/next-router')
    const vaultEnv = await vault.get()
    const child = fork(routerBin, ['--daemon'], {
      env: {
        ...process.env,
        ...vaultEnv
      },
      stdio: 'inherit'
    })

    await new Promise<void>((resolve, reject) => {
      // command will exit immediately, hopefully having started the router in the background
      child.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          // TODO capture output from next-router and use ToolKitError?
          reject(new Error(`couldn't start next-router. there's probably more information above.`))
        }
      })
    })

    const local = readState('local')
    if (!local) {
      const error = new ToolKitError('no locally running app found')
      error.details = `make sure there's a task running your app, e.g. via the "node" plugin, configured to run before the next-router task.`
      throw error
    }

    await register({ service: this.options.appName, port: local.port })
  }
}
