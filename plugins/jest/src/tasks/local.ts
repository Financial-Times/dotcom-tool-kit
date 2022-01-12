import { Task } from '@dotcom-tool-kit/types'
import { JestSchema } from '@dotcom-tool-kit/types/src/schema/jest'
import runJest from '../run-jest'

export default class JestLocal extends Task<typeof JestSchema> {
   static description = ''

   async run(): Promise<void> {
    await runJest('local', this.options)
  }
}
