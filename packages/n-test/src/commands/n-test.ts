import { Command } from '@dotcom-tool-kit/command'
import { SmokeTest, SmokeTestOptions } from '@financial-times/n-test'

export default class NTest extends Command {
  static description = ''

  options: SmokeTestOptions = {}

  async run(): Promise<void> {
    const smokeTest = new SmokeTest(this.options)
    await smokeTest.run()
  }
}
