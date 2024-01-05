import path from 'path'
import type { Logger } from 'winston'

import { loadPlugin, resolvePlugin } from './plugin'
import {
  findConflicts,
  withoutConflicts,
  isConflict,
  findConflictingEntries
} from '@dotcom-tool-kit/conflict'
import { ToolKitConflictError } from '@dotcom-tool-kit/error'
import { RawConfig, ValidConfig, ValidPluginsConfig } from '@dotcom-tool-kit/types'
import {
  formatTaskConflicts,
  formatUndefinedCommandTasks,
  formatUnusedOptions,
  formatCommandTaskConflicts,
  formatHookConflicts,
  formatOptionConflicts,
  formatMissingTasks,
  formatInvalidOptions
} from './messages'
import { validatePlugins } from './config/validate-plugins'
import { validatePluginOptions } from './plugin/options'

const coreRoot = path.resolve(__dirname, '../')

export const createConfig = (): RawConfig => ({
  root: coreRoot,
  plugins: {},
  resolvedPlugins: new Set(),
  tasks: {},
  commandTasks: {},
  options: {},
  hooks: {},
  inits: []
})

export function validateConfig(config: ValidPluginsConfig, logger: Logger): ValidConfig {
  const validConfig = config as ValidConfig

  const commandTaskConflicts = findConflicts(Object.values(config.commandTasks))
  const hookConflicts = findConflictingEntries(config.hooks)
  const taskConflicts = findConflictingEntries(config.tasks)
  const optionConflicts = findConflicts(Object.values(config.options))

  const definedCommandTaskConflicts = commandTaskConflicts.filter((conflict) => {
    return conflict.conflicting[0].id in config.hooks
  })

  let shouldThrow = false
  const error = new ToolKitConflictError(
    'There are problems with your Tool Kit configuration.',
    commandTaskConflicts.map((conflict) => ({
      command: conflict.conflicting[0].id,
      conflictingTasks: conflict.conflicting.flatMap((command) =>
        command.tasks.map((task) => ({ task, plugin: command.plugin.id }))
      )
    }))
  )
  error.details = ''

  if (
    hookConflicts.length > 0 ||
    definedCommandTaskConflicts.length > 0 ||
    taskConflicts.length > 0 ||
    optionConflicts.length > 0
  ) {
    shouldThrow = true

    if (hookConflicts.length) {
      error.details += formatHookConflicts(hookConflicts)
    }

    if (definedCommandTaskConflicts.length) {
      error.details += formatCommandTaskConflicts(definedCommandTaskConflicts)
    }

    if (taskConflicts.length) {
      error.details += formatTaskConflicts(taskConflicts)
    }

    if (optionConflicts.length) {
      error.details += formatOptionConflicts(optionConflicts)
    }
  }

  const configuredCommandTasks = withoutConflicts(Object.values(config.commandTasks))
  const definedHookIds = new Set(Object.keys(config.hooks))
  const undefinedCommandTasks = configuredCommandTasks.filter(() => {
    return false //TODO
    // we only care about undefined hooks that were configured by the app, not default config from plugins
    // const fromApp = commandTask.plugin.root === process.cwd()
    // const hookDefined = definedHookIds.has(commandTask.id)
    // return fromApp && !hookDefined
  })

  if (undefinedCommandTasks.length > 0) {
    shouldThrow = true
    error.details += formatUndefinedCommandTasks(undefinedCommandTasks, Array.from(definedHookIds))
  }

  const invalidOptions = validatePluginOptions(logger, config)

  if (invalidOptions.length > 0) {
    shouldThrow = true
    error.details += formatInvalidOptions(invalidOptions)
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

  const missingTasks = configuredCommandTasks
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

  return validConfig
}

export function loadConfig(logger: Logger, options?: { validate?: true }): Promise<ValidConfig>
export function loadConfig(logger: Logger, options?: { validate?: false }): Promise<RawConfig>

export async function loadConfig(logger: Logger, { validate = true } = {}): Promise<ValidConfig | RawConfig> {
  const config = createConfig()

  // start loading config and child plugins, starting from the consumer app directory
  const rootPlugin = await loadPlugin('app root', config, logger)
  const validRootPlugin = rootPlugin.unwrap('root plugin was not valid!')

  const validatedPluginConfig = validatePlugins(config)
  const validPluginConfig = validatedPluginConfig.unwrap('config was not valid!')

  // collate root plugin and descendent hooks, options etc into config
  resolvePlugin(validRootPlugin, validPluginConfig, logger)

  return validate ? validateConfig(validPluginConfig, logger) : config
}
