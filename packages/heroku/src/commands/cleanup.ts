import { Command } from '@dotcom-tool-kit/command'
import { readState } from '@dotcom-tool-kit/state'
import scaleDyno from '../scaleDyno'

export default class HerokuCleanup extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run(): Promise<void> {
    //scale down staging
    const appName = readState('staging')?.appName || ''
    await scaleDyno(appName, 0)
  }
}
