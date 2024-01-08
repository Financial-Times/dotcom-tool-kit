import { Task } from '@dotcom-tool-kit/base'
import { JestSchema } from '@dotcom-tool-kit/schemas/lib/plugins/jest'
import runJest from '../run-jest'

export default class JestCI extends Task<typeof JestSchema> {
  static description = ''

  async run(): Promise<void> {
    await runJest(this.logger, 'ci', this.pluginOptions)
  }
}
