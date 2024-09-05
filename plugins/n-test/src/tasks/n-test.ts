import { styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { SmokeTestSchema } from '@dotcom-tool-kit/schemas/lib/tasks/n-test'
import { SmokeTest } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Task<{ task: typeof SmokeTestSchema }> {
  async run(): Promise<void> {
    const appState = readState('review') ?? readState('staging')

    // if we've built a review or staging app, test against that, not the app in the config
    if (appState) {
      this.options.host = appState.url
      // HACK:20231003:IM n-test naively appends paths to the host URL so
      // expects there to be no trailing slash
      if (this.options.host.endsWith('/')) {
        this.options.host = this.options.host.slice(0, -1)
      }
    }

    const smokeTest = new SmokeTest(this.options)
    this.logger.info(
      `Running smoke test${this.options.host ? ` for URL ${styles.URL(this.options.host)}` : ''}`
    )
    await smokeTest.run()
  }
}
