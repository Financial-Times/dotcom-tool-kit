import { Command } from '@dotcom-tool-kit/command'
import runWebpack from '../../run-webpack'

export default class WebpackDevelopment extends Command {
  static description = 'build webpack'
  static hidden = true

  async run(): Promise<void> {
    await runWebpack(this.argv, 'development')
  }
}
