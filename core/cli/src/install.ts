import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import type { Logger } from 'winston'
import { loadConfig, ValidConfig } from './config'
import { postInstall } from './postInstall'

export default async function installHooks(logger: Logger): Promise<ValidConfig> {
  const config = await loadConfig(logger)

  const tasks = Object.values(config.hooks).map((hook) => async () => {
    if (!(await hook.check())) {
      await hook.install()
    }
  })

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
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
  // Hack: for now we will do a postinstall, later we shall refactor circleciconfighook so we dont need to postinstall
  await postInstall(logger)

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => `- ${error.message}`).join('\n')
    throw error
  }

  return config
}
