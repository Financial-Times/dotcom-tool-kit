import { runBabel } from '../run-babel'
import { Task } from '@dotcom-tool-kit/types'
import { BabelSchema } from '@dotcom-tool-kit/types/lib/schema/babel'

export default class BabelDevelopment extends Task<typeof BabelSchema> {
  static description = 'build babel'

  async run(): Promise<void> {
    await runBabel(this.logger, this.options)
  }
}
