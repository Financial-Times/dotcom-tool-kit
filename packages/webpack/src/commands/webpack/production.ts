import { Command } from '@oclif/command'
import runWebpack from '../../run-webpack'

export default class WebpackProduction extends Command {
  static description = 'build webpack'
  static args = []
  static flags = {}
  static hidden = true

  async run(): Promise<void> {
    runWebpack(this.argv, 'production')
  }
}
