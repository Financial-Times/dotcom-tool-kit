import { Task } from '@dotcom-tool-kit/task'
import runWebpack, { WebpackOptions } from '../run-webpack'

export default class WebpackDevelopment extends Task<WebpackOptions> {
  static description = 'build webpack'
  static hidden = true

  async run(): Promise<void> {
    await runWebpack({
      ...this.options,
      mode: 'development'
    })
  }
}
