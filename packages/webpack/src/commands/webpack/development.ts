import { Command } from '@oclif/command'
import { Build } from '@dotcom-tool-kit/build'

export default class WebpackDevelopment extends Command {
  static description = 'build webpack'
  static args = []
  static flags = {}
  static hidden = true

  static lifecycles = [Build.Local]

  async run() {
    console.log('webpack development')
  }
}
