import { Command, run } from '@oclif/command'
import { runLifecycle } from '@dotcom-tool-kit/lifecycles'
import { Test } from '../../'

export default class TestLocal extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      return runLifecycle(Test.Local, this.argv, this.config)
   }
}
