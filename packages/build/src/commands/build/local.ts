import { Command } from '@oclif/command'
import { Build } from '../../'
import { runLifecycle } from '@dotcom-tool-kit/lifecycles'

export default class BuildLocal extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run() {
    return runLifecycle(Build.Local, this.argv, this.config)
  }
}
