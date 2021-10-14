import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import getHerokuStagingApp from '../getHerokuStagingApp'
import setConfigVars from '../setConfigVars'
import scaleDyno from '../scaleDyno'
import gtg from '../gtg'
import getPipelineCouplings from '../getPipelineCouplings'
import { HerokuOptions, HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'

export default class HerokuStaging extends Task<typeof HerokuSchema> {
  static description = ''

  static defaultOptions: HerokuOptions = {
    vaultTeam: undefined,
    vaultApp: undefined,
    pipeline: undefined,
    systemCode: undefined
  }

  async run(): Promise<void> {
    try {
      if (!this.options.pipeline || !this.options.systemCode) {
        const error = new ToolKitError('no pipeline and/or system code option in your Tool Kit configuration')
        error.details = `the Heroku plugin needs to know your pipeline name or Biz Ops' system code to deploy staging. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    pipeline: your-heroku-pipeline
    systemCode: your-system-code`

        throw error
      }

      console.log(`retrieving pipeline details...`)
      await getPipelineCouplings(this.options.pipeline)

      console.log(`restrieving staging app details...`)
      const appName = await getHerokuStagingApp()

      //apply vars from vault
      if (!this.options.vaultTeam || !this.options.vaultApp) {
        const error = new ToolKitError('Vault options not found in your Tool Kit configuration')
        error.details = `vaultTeam and vaultApp are needed to get your app's secrets from vault, e.g.
        options:
          '@dotcom-tool-kit/heroku':
              vaultTeam: "next",
              vaultApp: "your-app"
            `
        throw error
      }

      await setConfigVars(
        appName,
        'production',
        { team: this.options.vaultTeam, app: this.options.vaultApp },
        this.options.systemCode
      )

      //scale up staging
      await scaleDyno(appName, 1)

      await gtg(appName, 'staging', false)
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`there's an error with your staging app`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
