import util from 'util'

import type { Logger } from 'winston'

import { loadConfig } from './config'
import { formatPluginTree } from './messages'

export { runTasks } from './tasks'
export { shouldDisableNativeFetch } from './fetch'

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
