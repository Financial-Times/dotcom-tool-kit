import { Task } from '@dotcom-tool-kit/task'
import { readState } from '@dotcom-tool-kit/state'
import { scaleDyno } from '../scaleDyno'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class HerokuTeardown extends Task {
  static description = ''

  async run(): Promise<void> {
    //scale down staging
    const state = readState('staging')

    if (!state || !state.appName) {
      throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
    }

    const appName = state.appName

    try {
      await scaleDyno(appName, 0)
    } catch {
      throw new ToolKitError(`Unable to scale down dyno for ${appName}`)
    }
  }
}
