import { loadConfig } from './config'
import type { Logger } from 'winston'
import util from 'util'
import { formatPluginTree } from './messages'
import { loadHookInstallations } from './install'

export { runCommands } from './tasks'
export { shouldDisableNativeFetch } from './fetch'

export async function listPlugins(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false, root: process.cwd() })

  const rootPlugin = config.plugins['app root']
  if (rootPlugin?.valid) {
    logger.info(formatPluginTree(rootPlugin.value).join('\n'))
  }
}

export async function printConfig(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false, root: process.cwd() })

  logger.info(util.inspect(config, { depth: null, colors: true }))
}

export async function printMergedOptions(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: true, root: process.cwd() })
  const hookInstallations = (await loadHookInstallations(logger, config)).unwrap('invalid hooks')

  const mergedOptions = {
    hooks: hookInstallations.map((h) => h.options),
    plugins: Object.fromEntries(
      Object.entries(config.pluginOptions).map(([pluginId, optionsForPlugin]) => [
        pluginId,
        optionsForPlugin.options
      ])
    ),
    tasks: Object.fromEntries(
      Object.entries(config.taskOptions).map(([taskId, optionsForTask]) => [taskId, optionsForTask.options])
    )
  }

  logger.info(util.inspect(mergedOptions, { depth: null, colors: true }))
}
