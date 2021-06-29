import { Command } from '@dotcom-tool-kit/command'
import runWebpack from '../../run-webpack'

export default class WebpackProduction extends Command {
  static description = 'build webpack'
  static hidden = true

  async run(): Promise<void> {
    await runWebpack(this.argv, 'production')
  }
}
