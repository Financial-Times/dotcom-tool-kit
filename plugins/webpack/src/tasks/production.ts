import { Task } from '@dotcom-tool-kit/base'
import { WebpackSchema } from '@dotcom-tool-kit/schemas/lib/plugins/webpack'
import runWebpack from '../run-webpack'

export default class WebpackProduction extends Task<{ plugin: typeof WebpackSchema }> {
  static description = 'Run Webpack in production mode'

  async run(): Promise<void> {
    await runWebpack(this.logger, {
      ...this.pluginOptions,
      mode: 'production'
    })
  }
}
