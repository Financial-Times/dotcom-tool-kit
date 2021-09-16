import { ToolKitError } from '@dotcom-tool-kit/error'
import { Config, loadConfig } from './config'

export default async function installHooks(): Promise<Config> {
  const config = await loadConfig({ checkInstall: false })

  const tasks = Object.values(config.hooks).map((Hook) => async () => {
    const hook = new Hook()

    if (!(await hook.check())) {
      await hook.install()
    }
  })

  const errors: Error[] = []
  for (const task of tasks) {
    try {
      await task()
    } catch (err) {
      if (err instanceof Error) {
        errors.push(err)
      } else {
        throw err
      }
    }
  }

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => error.message).join('\n\n')
    throw error
  }

  return config
}
