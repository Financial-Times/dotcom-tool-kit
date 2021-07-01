import { Command } from '@dotcom-tool-kit/command'
import { SmokeTest, SmokeTestOptions } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Command {
  static description = ''

  options: SmokeTestOptions = {}

  constructor(argv: string[]) {
    super(argv)

    const reviewState = readState('review')

    // if we've built a review app, test against that, not the app in the config
    if (reviewState) {
      this.options.host = `https://${reviewState.appId}.herokuapp.com`
    }
  }

  async run(): Promise<void> {
    const smokeTest = new SmokeTest(this.options)
    await smokeTest.run()
  }
}
