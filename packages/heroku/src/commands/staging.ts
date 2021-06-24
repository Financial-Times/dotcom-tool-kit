import { Command } from '@oclif/command'
import { readState, writeState } from '@dotcom-tool-kit/state'
import setConfigVars from '../setConfigVars'
import scaleDyno from '../scaleDyno'
import gtg from '../gtg'

export default class HerokuStaging extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run(): Promise<void> {
    try {
      const repo = readState('ci')?.repo
      const appName = `ft-${repo}-staging`
      writeState('staging', { appName })
      //apply vars from vault
      await setConfigVars(appName, 'production')
      //scale up staging
      await scaleDyno(appName, 1)

      await gtg(appName, 'staging', false)
      process.exit(0)
    } catch (err) {
      console.error(`There's an error with your staging app:, ${err}`) // eslint-disable-line no-console
      process.exit(1)
    }
  }
}
