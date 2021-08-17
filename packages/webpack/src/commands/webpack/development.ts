import { Task } from '@dotcom-tool-kit/task'
import runWebpack from '../../run-webpack'

export default class WebpackDevelopment extends Task {
  static description = 'build webpack'
  static hidden = true

  async run(): Promise<void> {
    await runWebpack(this.argv, 'development')
  }
}
