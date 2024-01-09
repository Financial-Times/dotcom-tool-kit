import { Task } from '@dotcom-tool-kit/base'
import { type BabelSchema } from '@dotcom-tool-kit/schemas/lib/plugins/babel'

import { runBabel } from '../run-babel'

export default class BabelDevelopment extends Task<typeof BabelSchema> {
  static description = 'build babel'

  async run(): Promise<void> {
    await runBabel(this.logger, this.options)
  }
}
