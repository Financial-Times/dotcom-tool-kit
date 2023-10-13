import { Task } from '@dotcom-tool-kit/types'
import { WebpackSchema } from '@dotcom-tool-kit/types/lib/schema/plugins/webpack'
import runWebpack from '../run-webpack'

export default class WebpackProduction extends Task<typeof WebpackSchema> {
  static description = 'Run Webpack in production mode'

  async run(): Promise<void> {
    await runWebpack(this.logger, {
      ...this.options,
      mode: 'production'
    })
  }
}
