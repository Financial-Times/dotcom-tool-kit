import styles from '@dotcom-tool-kit/styles'
import { Task } from '@dotcom-tool-kit/types'
import { SmokeTestSchema } from '@dotcom-tool-kit/types/lib/schema/n-test'
import { SmokeTest } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Task<typeof SmokeTestSchema> {
  static description = ''

  async run(): Promise<void> {
    const reviewState = readState('review')

    // if we've built a review app, test against that, not the app in the config
    if (reviewState) {
      this.options.host = `https://${reviewState.appName}.herokuapp.com`
    }

    const smokeTest = new SmokeTest(this.options)
    this.logger.info(
      `Running smoke test${this.options.host ? ` for URL ${styles.URL(this.options.host)}` : ''}`
    )
    await smokeTest.run()
  }
}
