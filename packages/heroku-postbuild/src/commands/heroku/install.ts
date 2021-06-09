import { Command } from '@oclif/command'
import { ensureHerokuPostbuildScript } from '../../'

export default class Install extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run(): Promise<void> {
    ensureHerokuPostbuildScript()
  }
}
