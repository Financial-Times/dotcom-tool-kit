import path from 'path'

import type { TaskClass } from '@dotcom-tool-kit/task'
import type { HookTask, HookClass } from './hook'
import { loadPluginConfig, Plugin } from './plugin'
import { Conflict, findConflicts, withoutConflicts, isConflict } from './conflict'
import { ToolKitConflictError, ToolKitError } from '@dotcom-tool-kit/error'
import {
  formatTaskConflicts,
  formatUndefinedHookTasks,
  formatUnusedOptions,
  formatHookTaskConflicts,
  formatHookConflicts,
  formatOptionConflicts,
  formatUninstalledHooks,
  formatMissingTasks
} from './messages'

export interface PluginOptions {
  options: Record<string, unknown>
  plugin: Plugin
  forPlugin: Plugin
}

export interface Config {
  root: string
  plugins: { [id: string]: Plugin }
  tasks: { [id: string]: TaskClass | Conflict<TaskClass> }
  hookTasks: { [id: string]: HookTask | Conflict<HookTask> }
  options: { [id: string]: PluginOptions | Conflict<PluginOptions> | undefined }
  hooks: { [id: string]: HookClass | Conflict<HookClass> }
}

export interface ValidConfig extends Config {
  tasks: { [id: string]: TaskClass }
  hookTasks: { [id: string]: HookTask }
  options: { [id: string]: PluginOptions }
  hooks: { [id: string]: HookClass }
}

const coreRoot = path.resolve(__dirname, '../')

const createConfig = (): Config => ({
  root: coreRoot,
  plugins: {},
  tasks: {},
  hookTasks: {},
  options: {},
  hooks: {}
})

async function asyncFilter<T>(items: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const results = await Promise.all(items.map(async (item) => ({ item, keep: await predicate(item) })))

  return results.filter(({ keep }) => keep).map(({ item }) => item)
}

export async function validateConfig(config: Config): Promise<ValidConfig> {
  const hookTaskConflicts = findConflicts(Object.values(config.hookTasks))
  const hookConflicts = findConflicts(Object.values(config.hooks))
  const taskConflicts = findConflicts(Object.values(config.tasks))
  const optionConflicts = findConflicts(Object.values(config.options))

  const definedHookTaskConflicts = hookTaskConflicts.filter((conflict) => {
    return conflict.conflicting[0].id in config.hooks
  })

  let shouldThrow = false
  const error = new ToolKitConflictError(
    'There are problems with your Tool Kit configuration.',
    hookTaskConflicts.map((conflict) => ({
      hook: conflict.conflicting[0].id,
      conflictingTasks: conflict.conflicting.flatMap((hook) =>
        hook.tasks.map((task) => ({ task, plugin: hook.plugin.id }))
      )
    }))
  )
  error.details = ''

  if (
    hookConflicts.length > 0 ||
    definedHookTaskConflicts.length > 0 ||
    taskConflicts.length > 0 ||
    optionConflicts.length > 0
  ) {
    shouldThrow = true

    if (hookConflicts.length) {
      error.details += formatHookConflicts(hookConflicts)
    }

    if (definedHookTaskConflicts.length) {
      error.details += formatHookTaskConflicts(definedHookTaskConflicts)
    }

    if (taskConflicts.length) {
      error.details += formatTaskConflicts(taskConflicts)
    }

    if (optionConflicts.length) {
      error.details += formatOptionConflicts(optionConflicts)
    }
  }

  const configuredHookTasks = withoutConflicts(Object.values(config.hookTasks))
  const definedHookIds = new Set(Object.keys(config.hooks))
  const undefinedHookTasks = configuredHookTasks.filter((hookTask) => {
    // we only care about undefined hooks that were configured by the app, not default config from plugins
    const fromApp = hookTask.plugin.root === process.cwd()
    const hookDefined = definedHookIds.has(hookTask.id)
    return fromApp && !hookDefined
  })

  if (undefinedHookTasks.length > 0) {
    shouldThrow = true
    error.details += formatUndefinedHookTasks(undefinedHookTasks, Array.from(definedHookIds))
  }

  const unusedOptions = Object.entries(config.options)
    .filter(
      ([, option]) =>
        option && !isConflict(option) && !option.forPlugin && option.plugin.root === process.cwd()
    )
    .map(([id]) => id)
  if (unusedOptions.length > 0) {
    shouldThrow = true
    error.details += formatUnusedOptions(unusedOptions, Object.keys(config.plugins))
  }

  const missingTasks = configuredHookTasks
    .map((hook) => ({
      hook,
      tasks: hook.tasks.filter((id) => !config.tasks[id])
    }))
    .filter(({ tasks }) => tasks.length > 0)

  if (missingTasks.length > 0) {
    shouldThrow = true
    error.details += formatMissingTasks(missingTasks, Object.keys(config.tasks))
  }

  if (shouldThrow) {
    throw error
  }

  return config as ValidConfig
}

export async function checkInstall(config: ValidConfig): Promise<void> {
  const definedHooks = withoutConflicts(Object.values(config.hooks))
  const uninstalledHooks = await asyncFilter(definedHooks, async (Hook) => {
    const hook = new Hook()
    return !(await hook.check())
  })

  if (uninstalledHooks.length > 0) {
    const error = new ToolKitError('There are problems with your Tool Kit installation.')
    error.details = formatUninstalledHooks(uninstalledHooks)
    throw error
  }
}

export function loadConfig(options?: { validate?: true }): Promise<ValidConfig>
export function loadConfig(options?: { validate?: false }): Promise<Config>

export async function loadConfig({ validate = true } = {}): Promise<ValidConfig | Config> {
  // start loading config and child plugins, starting from the consumer app directory
  const config = await loadPluginConfig(
    {
      id: 'app root',
      root: process.cwd()
    },
    createConfig()
  )

  return validate ? validateConfig(config) : config
}
