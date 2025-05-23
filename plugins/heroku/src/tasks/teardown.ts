import { Task } from '@dotcom-tool-kit/base'
import { readState } from '@dotcom-tool-kit/state'
import { styles } from '@dotcom-tool-kit/logger'
import { scaleDyno } from '../scaleDyno'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class HerokuTeardown extends Task {
  static description = "Scale down the Heroku staging app once it's no longer needed."

  async run(): Promise<void> {
    //scale down staging
    const state = readState('staging')

    if (!state || !state.appName) {
      throw new ToolKitError(
        `Could not find state for staging, check that ${styles.hook('deploy:staging')} ran successfully`
      )
    }

    const appName = state.appName

    try {
      await scaleDyno(this.logger, appName, 0)
    } catch {
      throw new ToolKitError(`Unable to scale down dyno for ${styles.app(appName)}`)
    }
  }
}
