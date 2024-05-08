import { loadConfig } from './config.js'
import type { Logger } from 'winston'
import util from 'util'
import { formatPluginTree } from './messages.js'

export type { loadConfig } from './config.js'
export type { default as installHooks } from './install.js'
export { runTasks } from './tasks.js'
export { shouldDisableNativeFetch } from './fetch.js'

export async function listPlugins(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false })

  const rootPlugin = config.plugins['app root']
  if (rootPlugin?.valid) {
    logger.info(formatPluginTree(rootPlugin.value).join('\n'))
  }
}

export async function printConfig(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false })

  logger.info(util.inspect(config, { depth: null, colors: true }))
}
