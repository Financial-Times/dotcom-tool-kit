import { Task } from '@dotcom-tool-kit/task'
import runWebpack, { WebpackOptions } from '../run-webpack'

export default class WebpackProduction extends Task<WebpackOptions> {
  static description = 'build webpack'

  async run(): Promise<void> {
    await runWebpack({
      ...this.options,
      mode: 'production'
    })
  }
}
