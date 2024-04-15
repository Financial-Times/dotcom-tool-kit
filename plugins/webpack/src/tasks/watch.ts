import { Task } from '@dotcom-tool-kit/base'
import { WebpackSchema } from '@dotcom-tool-kit/schemas/lib/plugins/webpack'
import runWebpack from '../run-webpack'

export default class WebpackWatch extends Task<{ plugin: typeof WebpackSchema }> {
  static description = 'Run Webpack in watch mode in the background'

  async run(): Promise<void> {
    // don't wait for Webpack to exit, to leave it running in the background
    runWebpack(this.logger, {
      ...this.pluginOptions,
      mode: 'development',
      watch: true
    })
  }
}
