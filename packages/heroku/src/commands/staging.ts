import { Command } from '@dotcom-tool-kit/command'
import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import setConfigVars from '../setConfigVars'
import scaleDyno from '../scaleDyno'
import gtg from '../gtg'

export default class HerokuStaging extends Command {
  static description = ''

  async run(): Promise<void> {
    try {
      const state = readState('ci')

      if (!state) {
        throw new ToolKitError('could not find CI state')
      }
      const repo = state.repo
      const appName = `ft-${repo}-staging`
      writeState('staging', { appName })
      //apply vars from vault
      await setConfigVars(appName, 'production')
      //scale up staging
      await scaleDyno(appName, 1)

      await gtg(appName, 'staging', false)
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`There's an error with your staging app`)
      error.details = err.message
      throw error
    }
  }
}
