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
      // HACK:20231003:IM keep the old logic of using the app name as the
      // subdomain to maintain backwards compatibility
      this.options.host =
        'url' in appState && appState.url ? appState.url : `https://${appState.appName}.herokuapp.com`
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
