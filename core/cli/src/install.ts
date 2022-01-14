import { ToolKitError } from '@dotcom-tool-kit/error'
import { setOptions } from '@dotcom-tool-kit/options'
import { Logger } from 'winston'
import { Config, loadConfig } from './config'

export default async function installHooks(logger: Logger): Promise<Config> {
  const config = await loadConfig(logger)

  const tasks = Object.values(config.hooks).map((hook) => async () => {
    if (!(await hook.check())) {
      await hook.install()
    }
  })

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as any, pluginOptions.options)
    }
  }

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
    error.details = errors.map((error) => `- ${error.message}`).join('\n')
    throw error
  }

  return config
}
