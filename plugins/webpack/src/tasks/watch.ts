import { Task } from '@dotcom-tool-kit/types'
import { WebpackSchema } from '@dotcom-tool-kit/types/lib/schema/webpack'
import runWebpack from '../run-webpack'

export default class WebpackWatch extends Task<typeof WebpackSchema> {
  static description = 'Run Webpack in watch mode in the background'

  async run(): Promise<void> {
    // don't wait for Webpack to exit, to leave it running in the background
    runWebpack(this.logger, {
      ...this.options,
      mode: 'development',
      watch: true
    })
  }
}
