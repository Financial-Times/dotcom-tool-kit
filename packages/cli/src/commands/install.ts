import { runCommand } from '../'
import { isConflict } from '../conflict'
import { config } from '../config'
import type { Command } from '../command'
import { ToolKitError } from '@dotcom-tool-kit/error'

const isRejected = (result: PromiseSettledResult<unknown>): result is PromiseRejectedResult =>
  result.status === 'rejected'

console.log('WTF')

export default class InstallCommand implements Command {
  static description = 'run lifecycle commands'

  async run() {
    const results = await Promise.allSettled(
      Object.entries(config.lifecycles).map(async ([id, Lifecycle]) => {
        if (isConflict(Lifecycle)) return

        const lifecycle = new Lifecycle()

        if (!(await lifecycle.check())) {
          await lifecycle.install()
        }
      })
    )

    console.log(results)

    const errors = results.filter(isRejected).map((result) => result.reason as Error)

    if (errors.length) {
      const error = new ToolKitError('could not automatically install lifecycles:')
      error.details = errors.map((error) => error.message).join('\n\n')
      throw error
    }
  }
}
