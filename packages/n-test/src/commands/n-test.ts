import { Command } from '@oclif/command'
import { SmokeTest, SmokeTestOptions } from '@financial-times/n-test'

export default class NTest extends Command {
   static description = ''
   static flags = {}
   static args = []

   options: SmokeTestOptions = {}

   async run() {
      const smokeTest = new SmokeTest(this.options)
      await smokeTest.run()
   }
}
