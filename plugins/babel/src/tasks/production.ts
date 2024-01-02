import { runBabel } from '../run-babel'
import { Task } from '@dotcom-tool-kit/types'
import { BabelSchema } from '@dotcom-tool-kit/schemas/lib/plugins/babel'

export default class BabelProduction extends Task<typeof BabelSchema> {
  static description = 'build babel'

  async run(): Promise<void> {
    await runBabel(this.logger, this.options, { envName: 'production' })
  }
}
