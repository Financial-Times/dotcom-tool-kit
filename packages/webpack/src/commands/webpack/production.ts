import { Command } from '@oclif/command'
import { Build } from '@dotcom-tool-kit/build'

export default class WebpackProduction extends Command {
  static description = 'build webpack'
  static args = []
  static flags = {}
  static hidden = true

  static lifecycles = [Build.CI, Build.Deploy]

  async run() {
    console.log('webpack production')
  }
}
