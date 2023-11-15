import { styles as s } from '@dotcom-tool-kit/logger'
import {
  Hook,
  mapValidated,
  mapValidationError,
  Plugin,
  PluginModule,
  reduceValidated,
  Task,
  Valid,
  Validated
} from '@dotcom-tool-kit/types'
import resolveFrom from 'resolve-from'
import type { Logger } from 'winston'
import { PluginOptions, RawConfig, ValidPluginsConfig } from './config'
import { Conflict, isConflict } from './conflict'
import type { CommandTask } from './command'
import { loadToolKitRC } from './rc-file'
import { isPlainObject } from 'lodash'

function isDescendent(possibleAncestor: Plugin, possibleDescendent: Plugin): boolean {
  if (!possibleDescendent.parent) {
    return false
  } else if (possibleDescendent.parent === possibleAncestor) {
    return true
  } else {
    return isDescendent(possibleAncestor, possibleDescendent.parent)
  }
}

const isPlainObjectGuard = (value: unknown): value is Record<string, unknown> => isPlainObject(value)

export type RawPluginModule = Partial<PluginModule>

export function validatePluginTasks(plugin: RawPluginModule): Validated<PluginModule['tasks']> {
  if (plugin.tasks) {
    if (!isPlainObjectGuard(plugin.tasks)) {
      return {
        valid: false,
        reasons: [`the exported ${s.code('tasks')} value from this plugin is not an object`]
      }
    } else {
      return mapValidated(
        reduceValidated(
          Object.entries(plugin.tasks).map(([id, task]) =>
            mapValidationError(
              mapValidated(Task.isCompatible<Task>(task), (task) => [id, task]),
              (reasons) => [
                `the task ${s.task(task.name)} is not a compatible instance of ${s.code(
                  'Task'
                )}:\n  - ${reasons.join('\n  - ')}`
              ]
            )
          )
        ),
        Object.fromEntries
      )
    }
  }

  return { valid: true, value: {} }
}

export function validatePluginHooks(plugin: RawPluginModule): Validated<PluginModule['hooks']> {
  if (plugin.hooks) {
    if (!isPlainObjectGuard(plugin.hooks)) {
      return {
        valid: false,
        reasons: [`the exported ${s.code('hooks')} value from this plugin is not an object`]
      }
    } else {
      return mapValidated(
        reduceValidated(
          Object.entries(plugin.hooks).map(([id, hook]) =>
            mapValidationError(
              mapValidated(Hook.isCompatible<Hook>(hook), (hook) => [id, hook]),
              (reasons) => [
                `the hook ${s.hook(id)} is not a compatible instance of ${s.code(
                  'Hook'
                )}:\n  - ${reasons.join('\n  - ')}`
              ]
            )
          )
        ),
        Object.fromEntries
      )
    }
  }
  return { valid: true, value: {} }
}

export async function importPlugin(pluginPath: string): Promise<Validated<unknown>> {
  try {
    // pluginPath is an absolute resolved path to a plugin module as found from its parent
    const pluginModule: unknown = await import(pluginPath)
    return {
      valid: true,
      value: pluginModule
    }
  } catch (e) {
    const err = e as Error
    return {
      valid: false,
      reasons: [
        `an error was thrown when loading this plugin's entrypoint:\n  ${s.code(
          indentReasons(err.toString())
        )}`
      ]
    }
  }
}

const indentReasons = (reasons: string): string => reasons.replace(/\n/g, '\n  ')

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
  let pluginRoot: string
  try {
    pluginRoot = isAppRoot ? root : resolveFrom(root, id)
  } catch (e) {
    return { valid: false, reasons: [`could not find path for name ${s.filepath(id)}`] }
  }

  const plugin: Valid<Plugin> = {
    valid: true,
    value: {
      id,
      root: pluginRoot,
      parent
    }
  }

  config.plugins[id] = plugin

  // ESlint disable explanation: erroring due to a possible race condition but is a false positive since the plugin variable isn't from another scope and can't be written to concurrently.
  // eslint-disable-next-line require-atomic-updates
  plugin.value.rcFile = await loadToolKitRC(logger, pluginRoot, isAppRoot)

  const children = await Promise.all(
    plugin.value.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin.value))
  )

  const validatedChildren = mapValidationError(reduceValidated(children), (reasons) => [
    indentReasons(`some child plugins of ${s.plugin(id)} failed to load:\n- ${reasons.join('\n- ')}`)
  ])

  return mapValidated(validatedChildren, (children) => {
    // avoid cloning the plugin value with an object spread as we do object
    // reference comparisons in multiple places
    plugin.value.children = children
    return plugin.value
  })
}

export function resolvePlugin(plugin: Plugin, config: ValidPluginsConfig, logger: Logger): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolvedPlugins.has(plugin)) {
    return
  }

  if (plugin.children) {
    // resolve child plugins first so parents can override the things their children set
    for (const child of plugin.children) {
      resolvePlugin(child, config, logger)
    }
  }

  if (plugin.rcFile) {
    // add plugin tasks to our task registry, handling any conflicts
    for (const taskName of plugin.rcFile.tasks || []) {
      const existingTaskId = config.tasks[taskName]

      if (existingTaskId) {
        const conflicting = isConflict(existingTaskId) ? existingTaskId.conflicting : [existingTaskId]

        config.tasks[taskName] = {
          plugin,
          conflicting: conflicting.concat(plugin.id)
        }
      } else {
        config.tasks[taskName] = plugin.id
      }
    }

    // add hooks to the registry, handling any conflicts
    // TODO refactor with command conflict handler
    for (const hookName of plugin.rcFile.installs || []) {
      const existingHookId = config.hooks[hookName]

      if (existingHookId) {
        const conflicting = isConflict(existingHookId) ? existingHookId.conflicting : [existingHookId]

        config.hooks[hookName] = {
          plugin,
          conflicting: conflicting.concat(plugin.id)
        }
      } else {
        config.hooks[hookName] = plugin.id
      }
    }

    // load plugin command tasks. do this after loading child plugins, so
    // parent commands get assigned after child commands and can override them
    for (const [id, configCommandTask] of Object.entries(plugin.rcFile.commands)) {
      // handle conflicts between commands from different plugins
      const existingCommandTask = config.commandTasks[id]
      const newCommandTask: CommandTask = {
        id,
        plugin,
        tasks: Array.isArray(configCommandTask) ? configCommandTask : [configCommandTask]
      }

      if (existingCommandTask) {
        const existingFromDescendent = isDescendent(plugin, existingCommandTask.plugin)

        // plugins can only override command tasks from their descendents, otherwise that's a conflict
        // return a conflict either listing this command and the siblings,
        // or merging in a previously-generated command
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingCommandTask)
            ? existingCommandTask.conflicting
            : [existingCommandTask]

          const conflict: Conflict<CommandTask> = {
            plugin,
            conflicting: conflicting.concat(newCommandTask)
          }

          config.commandTasks[id] = conflict
        } else {
          // if we're here, any existing command is from a child plugin,
          // so the parent always overrides it
          config.commandTasks[id] = newCommandTask
        }
      } else {
        // this command task might not have been set yet, in which case use the new one
        config.commandTasks[id] = newCommandTask
      }
    }

    // merge options from this plugin's config with any options we've collected already
    // TODO this is almost the exact same code as for command tasks, refactor
    for (const [id, configOptions] of Object.entries(plugin.rcFile.options)) {
      // users can specify root options with the dotcom-tool-kit key to mirror
      // the name of the root npm package
      const pluginId = id === 'dotcom-tool-kit' ? 'app root' : id
      const existingOptions = config.options[pluginId]

      const pluginOptions: PluginOptions = {
        options: configOptions,
        plugin,
        forPlugin: config.plugins[pluginId]
      }

      if (existingOptions) {
        const existingFromDescendent = isDescendent(plugin, existingOptions.plugin)

        // plugins can only override options from their descendents, otherwise it's a conflict
        // return a conflict either listing these options and the sibling's,
        // or merging in previously-generated options
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingOptions) ? existingOptions.conflicting : [existingOptions]

          const conflict: Conflict<PluginOptions> = {
            plugin,
            conflicting: conflicting.concat(pluginOptions)
          }

          config.options[pluginId] = conflict
        } else {
          // if we're here, any existing options are from a child plugin,
          // so merge in overrides from the parent
          config.options[pluginId] = { ...existingOptions, ...pluginOptions }
        }
      } else {
        // this options key might not have been set yet, in which case use the new one
        config.options[pluginId] = pluginOptions
      }
    }
  }

  config.resolvedPlugins.add(plugin)
}
