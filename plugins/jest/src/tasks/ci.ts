import { Task } from '@dotcom-tool-kit/types'
import { JestSchema } from '@dotcom-tool-kit/types/lib/schema/plugins/jest'
import runJest from '../run-jest'

export default class JestCI extends Task<typeof JestSchema> {
  static description = ''

  async run(): Promise<void> {
    await runJest(this.logger, 'ci', this.options)
  }
}
