import { Command } from '@oclif/command'
import { Build } from '../../'
import { runLifecycle } from '@dotcom-tool-kit/lifecycles'

export default class BuildCI extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run() {
    return runLifecycle(Build.CI, this.argv, this.config)
  }
}
