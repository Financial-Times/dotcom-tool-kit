import { styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { SmokeTestSchema } from '@dotcom-tool-kit/schemas/lib/plugins/n-test'
import { SmokeTest } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'

export default class NTest extends Task<{ plugin: typeof SmokeTestSchema }> {
  static description = ''

  async run(): Promise<void> {
    const appState = readState('review') ?? readState('staging')

    // if we've built a review or staging app, test against that, not the app in the config
    if (appState) {
      // HACK:20231003:IM keep the old logic of using the app name as the
      // subdomain to maintain backwards compatibility
      this.pluginOptions.host =
        'url' in appState && appState.url ? appState.url : `https://${appState.appName}.herokuapp.com`
      // HACK:20231003:IM n-test naively appends paths to the host URL so
      // expects there to be no trailing slash
      if (this.pluginOptions.host.endsWith('/')) {
        this.pluginOptions.host = this.pluginOptions.host.slice(0, -1)
      }
    }

    const smokeTest = new SmokeTest(this.pluginOptions)
    this.logger.info(
      `Running smoke test${this.pluginOptions.host ? ` for URL ${styles.URL(this.pluginOptions.host)}` : ''}`
    )
    await smokeTest.run()
  }
}
