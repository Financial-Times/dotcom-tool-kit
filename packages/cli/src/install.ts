import { loadConfig } from './config'
import { ToolKitError } from '@dotcom-tool-kit/error'

const isRejected = (result: PromiseSettledResult<unknown>): result is PromiseRejectedResult =>
  result.status === 'rejected'

export default async function installHooks(): Promise<void> {
  const config = await loadConfig({ checkInstall: false })

  const results = await Promise.allSettled(
    Object.values(config.hooks).map(async (Hook) => {
      const hook = new Hook()

      if (!(await hook.check())) {
        await hook.install()
      }
    })
  )

  const errors = results.filter(isRejected).map((result) => result.reason as Error)

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => error.message).join('\n\n')
    throw error
  }
}
