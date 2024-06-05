import { styles as s } from '@dotcom-tool-kit/logger'
import { CURRENT_RC_FILE_VERSION, type Plugin } from '@dotcom-tool-kit/plugin'
import type { RawConfig, ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { invalid, reduceValidated, valid, Validated } from '@dotcom-tool-kit/validated'
import * as path from 'path'
import type { Logger } from 'winston'
import resolvePackagePath from 'resolve-package-path'
import { loadToolKitRC } from './rc-file.js'
import { indentReasons } from './messages.js'
import { mergeTasks } from './plugin/merge-tasks.js'
import { mergeHooks } from './plugin/merge-hooks.js'
import { mergeCommands } from './plugin/merge-commands.js'
import { mergePluginOptions } from './plugin/merge-plugin-options.js'
import { mergeInits } from './plugin/merge-inits.js'
import { mergeTaskOptions } from './plugin/merge-task-options.js'

function resolveRoot(id: string, root: string): string {
  const isPath = id.startsWith('.') || id.startsWith('/')
  // resolve the package.json of a plugin as many plugins don't have valid
  // entrypoints now that we're intending their tasks/hooks to be loaded via
  // entrypoints defined in config
  const resolvedPath = isPath ? path.join(root, id) : path.dirname(resolvePackagePath(id, root)!)
  return resolvedPath
}

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
  const pluginRoot = isAppRoot ? root : resolveRoot(id, root)
  if (!pluginRoot) {
    return invalid([`could not find path for name ${s.filepath(id)}`])
  }

  const plugin = {
    id,
    root: pluginRoot,
    parent,
    rcFile: await loadToolKitRC(logger, pluginRoot),
    children: [] as Plugin[]
  }

  if (!isAppRoot && plugin.rcFile.version !== CURRENT_RC_FILE_VERSION) {
    return invalid([
      `plugin ${s.plugin(id)} has a v${s.code((plugin.rcFile.version ?? 1).toString())} ${s.code(
        '.toolkitrc.yml'
      )}, but this version of Tool Kit can only load v${s.code(
        CURRENT_RC_FILE_VERSION.toString()
      )}. please update this plugin.`
    ])
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

export function resolvePluginOptions(plugin: Plugin, config: ValidPluginsConfig): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolutionTrackers.resolvedPluginOptions.has(plugin.id)) {
    return
  }

  if (plugin.children) {
    // resolve child plugins first so parents can override the things their children set
    for (const child of plugin.children) {
      resolvePluginOptions(child, config)
    }
  }

  mergePluginOptions(config, plugin)

  config.resolutionTrackers.resolvedPluginOptions.add(plugin.id)
}

export function resolvePlugin(plugin: Plugin, config: ValidPluginsConfig, logger: Logger): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolutionTrackers.resolvedPlugins.has(plugin.id)) {
    return
  }

  if (plugin.children) {
    // resolve child plugins first so parents can override the things their children set
    for (const child of plugin.children) {
      resolvePlugin(child, config, logger)
    }
  }

  mergeTasks(config, plugin)
  mergeHooks(config, plugin)
  mergeCommands(config, plugin, logger)
  mergeTaskOptions(config, plugin)
  mergeInits(config, plugin)

  config.resolutionTrackers.resolvedPlugins.add(plugin.id)
}
