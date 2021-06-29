import { Command } from '@dotcom-tool-kit/command'
import { ensureHerokuPostbuildScript } from '../../'

export default class Install extends Command {
  static description = ''

  async run(): Promise<void> {
    ensureHerokuPostbuildScript()
  }
}
