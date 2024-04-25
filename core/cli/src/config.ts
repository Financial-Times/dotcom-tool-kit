import path from 'path'
import type { Logger } from 'winston'

import { loadPlugin, resolvePlugin, resolvePluginOptions } from './plugin'
import {
  findConflicts,
  withoutConflicts,
  isConflict,
  findConflictingEntries
} from '@dotcom-tool-kit/conflict'
import { ToolKitConflictError } from '@dotcom-tool-kit/error'
import { RawConfig, ValidConfig, ValidPluginsConfig } from '@dotcom-tool-kit/config'
import {
  formatTaskConflicts,
  formatUnusedPluginOptions,
  formatCommandTaskConflicts,
  formatHookConflicts,
  formatPluginOptionConflicts,
  formatMissingTasks,
  formatInvalidOptions,
  formatTaskOptionConflicts,
  formatUnusedTaskOptions
} from './messages'
import { validatePlugins } from './config/validate-plugins'
import { substituteOptionTags, validatePluginOptions } from './plugin/options'

const coreRoot = path.resolve(__dirname, '../')

export const createConfig = (): RawConfig => ({
  root: coreRoot,
  plugins: {},
  resolutionTrackers: {
    resolvedPluginOptions: new Set(),
    substitutedPlugins: new Set(),
    resolvedPlugins: new Set()
  },
  tasks: {},
  commandTasks: {},
  pluginOptions: {},
  taskOptions: {},
  hooks: {},
  inits: [],
  hookManagedFiles: new Set()
})

export function validateConfig(config: ValidPluginsConfig, logger: Logger): ValidConfig {
  const validConfig = config as ValidConfig

  const commandTaskConflicts = findConflicts(Object.values(config.commandTasks))
  const hookConflicts = findConflictingEntries(config.hooks)
  const taskConflicts = findConflictingEntries(config.tasks)
  const pluginOptionConflicts = findConflicts(Object.values(config.pluginOptions))
  const taskOptionConflicts = findConflicts(Object.values(config.taskOptions))

  const definedCommandTaskConflicts = commandTaskConflicts.filter((conflict) => {
    return conflict.conflicting[0].id in config.hooks
  })

  let shouldThrow = false
  const error = new ToolKitConflictError(
    'There are problems with your Tool Kit configuration.',
    commandTaskConflicts.map((conflict) => ({
      command: conflict.conflicting[0].id,
      conflictingTasks: conflict.conflicting.flatMap((command) =>
        command.tasks.map((task) => ({ task: task.task, plugin: command.plugin.id }))
      )
    }))
  )
  error.details = ''

  if (
    hookConflicts.length > 0 ||
    definedCommandTaskConflicts.length > 0 ||
    taskConflicts.length > 0 ||
    pluginOptionConflicts.length > 0 ||
    taskOptionConflicts.length > 0
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

    if (pluginOptionConflicts.length) {
      error.details += formatPluginOptionConflicts(pluginOptionConflicts)
    }

    if (taskOptionConflicts.length) {
      error.details += formatTaskOptionConflicts(taskOptionConflicts)
    }
  }

  const invalidOptions = validatePluginOptions(logger, config)

  if (invalidOptions.length > 0) {
    shouldThrow = true
    error.details += formatInvalidOptions(invalidOptions)
  }

  const unusedPluginOptions = Object.entries(config.pluginOptions)
    .filter(
      ([, option]) =>
        option && !isConflict(option) && !option.forPlugin && option.plugin.root === process.cwd()
    )
    .map(([id]) => id)

  if (unusedPluginOptions.length > 0) {
    shouldThrow = true
    error.details += formatUnusedPluginOptions(unusedPluginOptions, Object.keys(config.plugins))
  }

  const unusedTaskOptions = Object.entries(config.taskOptions)
    .filter(
      ([, option]) => option && !isConflict(option) && !option.task && option.plugin.root === process.cwd()
    )
    .map(([id]) => id)

  if (unusedTaskOptions.length > 0) {
    shouldThrow = true
    error.details += formatUnusedTaskOptions(unusedTaskOptions, Object.keys(config.tasks))
  }

  const configuredCommandTasks = withoutConflicts(Object.values(config.commandTasks))

  const missingTasks = configuredCommandTasks
    .map((command) => ({
      command,
      tasks: command.tasks.filter((task) => !config.tasks[task.task])
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
  // start with options so we can substitute resolved values into other parts
  // of the config
  resolvePluginOptions(validRootPlugin, validPluginConfig)
  substituteOptionTags(validRootPlugin, validPluginConfig)
  resolvePlugin(validRootPlugin, validPluginConfig, logger)

  return validate ? validateConfig(validPluginConfig, logger) : config
}
