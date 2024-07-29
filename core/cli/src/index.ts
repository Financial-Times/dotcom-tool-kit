import { loadConfig } from './config'
import type { Logger } from 'winston'
import util from 'util'
import { formatPluginTree } from './messages'

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
