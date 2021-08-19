import { Task } from '@dotcom-tool-kit/task'
import { SmokeTest, SmokeTestOptions } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Task {
  static description = ''

  constructor(public options: SmokeTestOptions = {}) {
    super()
  }

  async run(): Promise<void> {
    const reviewState = readState('review')

    // if we've built a review app, test against that, not the app in the config
    if (reviewState) {
      this.options.host = `https://${reviewState.appName}.herokuapp.com`
    }

    const smokeTest = new SmokeTest(this.options)
    await smokeTest.run()
  }
}
