import { Task } from '@dotcom-tool-kit/types'
import runJest from '../run-jest'

export default class JestLocal extends Task {
   static description = ''

   async run(): Promise<void> {
    await runJest('local', this.options)
  }
}
