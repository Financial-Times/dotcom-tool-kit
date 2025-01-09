import { styles } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { SmokeTestSchema } from '@dotcom-tool-kit/schemas/lib/tasks/n-test'
import { SmokeTest } from '@financial-times/n-test'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class NTest extends Task<{ task: typeof SmokeTestSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
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

    if (cwd !== process.cwd()) {
      const error = new ToolKitError('the NTest task must be run from the current working directory')
      error.details = `n-test prepends the config file path with the current working directory so it's not possible to resolve the config path properly if you're running this task from elsewhere`
      throw error
    }

    const smokeTest = new SmokeTest(this.options)
    this.logger.info(
      `Running smoke test${this.options.host ? ` for URL ${styles.URL(this.options.host)}` : ''}`
    )
    await smokeTest.run()
  }
}
