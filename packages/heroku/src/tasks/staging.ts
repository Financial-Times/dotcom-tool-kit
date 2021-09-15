import { Task } from '@dotcom-tool-kit/task'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import setConfigVars from '../setConfigVars'
import scaleDyno from '../scaleDyno'
import gtg from '../gtg'
import getSlug from '../getSlug'
import type { VaultPath } from '@dotcom-tool-kit/vault'

type HerokuStagingOptions = {
  vaultPath?: VaultPath
}

export default class HerokuStaging extends Task {
  static description = ''

  static defaultOptions: HerokuStagingOptions = {
    vaultPath: undefined
  }

  constructor(public options: HerokuStagingOptions = HerokuStaging.defaultOptions) {
    super()
  }

  async run(): Promise<void> {
    try {
      const state = readState('ci')

      if (!state) {
        throw new ToolKitError('could not find CI state')
      }
      const { repo, version } = state
      const appName = `ft-${repo}-staging`

      console.log(`retreiving staging app's latest deployed commit...`)
      const { commit } = await getSlug()

      if (version !== commit) {
        const error = new ToolKitError('your staging does not have your latest commit')
        error.message = `If this is the first time you've seen this message, try re-running the pipeline. 
        Otherwise check that you've set up automatic deployments for your staging app in heroku, and refer to the build logs of your staging app.`
        throw error
      }

      console.log(`deployed commit is latest (${version.slice(0, 7)})`)
      if (!this.options.vaultPath) {
        const error = new ToolKitError('no vaultPath option in your Tool Kit configuration')
        error.details = `the vaultPath is needed to get your app's secrets from vault, e.g.
        options:
          '@dotcom-tool-kit/heroku':
            vaultPath:
              team: "next"
              app: "your-app"
          `
        throw error
      }

      await setConfigVars(appName, 'production', this.options.vaultPath)

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
