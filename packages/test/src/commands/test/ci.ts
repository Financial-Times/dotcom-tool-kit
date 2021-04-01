import { Command, run } from '@oclif/command'
import { runLifecycle } from '@dotcom-tool-kit/lifecycles'
import { Test } from '../../'

export default class TestCI extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      return runLifecycle(Test.CI, this.argv, this.config)
   }
}
