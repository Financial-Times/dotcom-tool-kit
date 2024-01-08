import { styles as s } from '@dotcom-tool-kit/logger'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import type { RawConfig, ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { invalid, reduceValidated, valid, Validated } from '@dotcom-tool-kit/validated'
import resolvePkg from 'resolve-pkg'
import type { Logger } from 'winston'
import { loadToolKitRC } from './rc-file'
import { indentReasons } from './messages'
import { mergePluginTasks } from './plugin/merge-tasks'
import { mergePluginHooks } from './plugin/merge-hooks'
import { mergePluginCommands } from './plugin/merge-commands'
import { mergePluginOptions } from './plugin/merge-plugin-options'
import { mergePluginInits } from './plugin/merge-inits'
import { mergeTaskOptions } from './plugin/merge-task-options'

export async function loadPlugin(
  id: string,
  config: RawConfig,
  logger: Logger,
  parent?: Plugin
): Promise<Validated<Plugin>> {
  // don't load duplicate plugins
  if (id in config.plugins) {
    return config.plugins[id]
  }

  const isAppRoot = id === 'app root'

  // load plugin relative to the parent plugin
  const root = parent ? parent.root : process.cwd()
  const pluginRoot = isAppRoot ? root : resolvePkg(id, { cwd: root })
  if (!pluginRoot) {
    return invalid([`could not find path for name ${s.filepath(id)}`])
  }

  const plugin = {
    id,
    root: pluginRoot,
    parent,
    rcFile: await loadToolKitRC(logger, pluginRoot, isAppRoot),
    children: [] as Plugin[]
  }

  // ESlint disable explanation: erroring due to a possible race condition but is a false positive since the config variable isn't from another scope and can't be written to concurrently.
  // eslint-disable-next-line require-atomic-updates
  config.plugins[id] = valid(plugin)

  const children = await Promise.all(
    plugin.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin))
  )

  return reduceValidated(children)
    .mapError((reasons) => [
      indentReasons(`some child plugins of ${s.plugin(id)} failed to load:\n- ${reasons.join('\n- ')}`)
    ])
    .map((children) => {
      // avoid cloning the plugin value with an object spread as we do object
      // reference comparisons in multiple places
      plugin.children = children
      return plugin
    })
}

export function resolvePlugin(plugin: Plugin, config: ValidPluginsConfig, logger: Logger): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolvedPlugins.has(plugin.id)) {
    return
  }

  if (plugin.children) {
    // resolve child plugins first so parents can override the things their children set
    for (const child of plugin.children) {
      resolvePlugin(child, config, logger)
    }
  }

  mergePluginTasks(config, plugin)
  mergePluginHooks(config, plugin)
  mergePluginCommands(config, plugin)
  mergePluginOptions(config, plugin)
  mergeTaskOptions(config, plugin)
  mergePluginInits(config, plugin)

  config.resolvedPlugins.add(plugin.id)
}
