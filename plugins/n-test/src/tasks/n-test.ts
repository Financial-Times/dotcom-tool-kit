import { styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { SmokeTestSchema } from '@dotcom-tool-kit/types/lib/schema/n-test'
import { SmokeTest } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Task<typeof SmokeTestSchema> {
  static description = ''

  async run(): Promise<void> {
    const appState = readState('review') ?? readState('staging')

    // if we've built a review or staging app, test against that, not the app in the config
    if (appState) {
      this.options.host = `https://${appState.appName}.herokuapp.com`
    }

    const smokeTest = new SmokeTest(this.options)
    this.logger.info(
      `Running smoke test${this.options.host ? ` for URL ${styles.URL(this.options.host)}` : ''}`
    )
    await smokeTest.run()
  }
}
