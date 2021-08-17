import { isConflict } from '../conflict'
import { config } from '../config'
import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'

const isRejected = (result: PromiseSettledResult<unknown>): result is PromiseRejectedResult =>
  result.status === 'rejected'

export default class InstallCommand extends Task {
  static description = 'run lifecycle commands'

  async run(): Promise<void> {
    const results = await Promise.allSettled(
      Object.values(config.lifecycles).map(async (Lifecycle) => {
        if (isConflict(Lifecycle)) return

        const lifecycle = new Lifecycle()

        if (!(await lifecycle.check())) {
          await lifecycle.install()
        }
      })
    )

    const errors = results.filter(isRejected).map((result) => result.reason as Error)

    if (errors.length) {
      const error = new ToolKitError('could not automatically install lifecycles:')
      error.details = errors.map((error) => error.message).join('\n\n')
      throw error
    }
  }
}
