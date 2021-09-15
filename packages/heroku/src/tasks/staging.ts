import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import getHerokuStagingApp from '../getHerokuStagingApp'
import setConfigVars from '../setConfigVars'
import scaleDyno from '../scaleDyno'
import gtg from '../gtg'

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
      const appName = await getHerokuStagingApp()

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
