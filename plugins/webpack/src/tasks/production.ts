import { Task } from '@dotcom-tool-kit/types'
import { WebpackSchema } from '@dotcom-tool-kit/types/lib/schema/webpack'
import runWebpack from '../run-webpack'

export default class WebpackProduction extends Task<typeof WebpackSchema> {
  static description = 'build webpack'

  async run(): Promise<void> {
    await runWebpack(this.logger, {
      ...this.options,
      mode: 'production'
    })
  }
}
