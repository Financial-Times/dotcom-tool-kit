import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

import path from 'path'
import type { Logger } from 'winston'

import type { CommandTask } from './command'
import { importEntryPoint, loadPlugin, resolvePlugin } from './plugin'
import {
  Conflict,
  findConflicts,
  withoutConflicts,
  isConflict,
  findConflictingEntries
} from '@dotcom-tool-kit/types/lib/conflict'
import { ToolKitConflictError, ToolKitError } from '@dotcom-tool-kit/error'
import { readState, configPaths, writeState } from '@dotcom-tool-kit/state'
import {
  Hook,
  HookConstructor,
  mapValidated,
  Plugin,
  reduceValidated,
  unwrapValidated,
  Validated
} from '@dotcom-tool-kit/types'
import { Options as SchemaOptions, Schemas } from '@dotcom-tool-kit/types/lib/plugins'
import {
  InvalidOption,
  formatTaskConflicts,
  formatUndefinedCommandTasks,
  formatUnusedOptions,
  formatCommandTaskConflicts,
  formatHookConflicts,
  formatOptionConflicts,
  formatUninstalledHooks,
  formatMissingTasks,
  formatInvalidOptions,
  formatHookOptionConflicts
} from './messages'

export interface PluginOptions {
  options: Record<string, unknown>
  plugin: Plugin
  forPlugin: Plugin
}

export interface HookOptions {
  options: Record<string, unknown>
  plugin: Plugin
  forHook: string
}

export interface EntryPoint {
  plugin: Plugin
  modulePath: string
}

export interface RawConfig {
  root: string
  plugins: { [id: string]: Validated<Plugin> }
  resolvedPlugins: Set<Plugin>
  tasks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  commandTasks: { [id: string]: CommandTask | Conflict<CommandTask> }
  options: { [id: string]: PluginOptions | Conflict<PluginOptions> | undefined }
  hooks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  hookOptions: { [id: string]: HookOptions | Conflict<HookOptions> }
}

export type ValidPluginsConfig = Omit<RawConfig, 'plugins'> & {
  plugins: { [id: string]: Plugin }
}

export type ValidPluginOptions<Id extends keyof SchemaOptions> = Omit<PluginOptions, 'options'> & {
  options: SchemaOptions[Id]
}

export type ValidOptions = {
  [Id in keyof SchemaOptions]: ValidPluginOptions<Id>
}

export type ValidConfig = Omit<ValidPluginsConfig, 'tasks' | 'commandTasks' | 'options' | 'hooks'> & {
  tasks: { [id: string]: EntryPoint }
  commandTasks: { [id: string]: CommandTask }
  options: ValidOptions
  hooks: { [id: string]: EntryPoint }
}

const coreRoot = path.resolve(__dirname, '../')

export const loadHooks = async (logger: Logger, config: ValidConfig): Promise<Validated<Hook<unknown>[]>> => {
  const hookResults = await Promise.all(
    Object.entries(config.hooks).map(async ([hookName, entryPoint]) => {
      const hookResult = await importEntryPoint(Hook, entryPoint)

      return mapValidated(hookResult, (Hook) => new ((Hook as unknown) as HookConstructor)(logger, hookName))
    })
  )

  return reduceValidated(hookResults)
}

export async function fileHash(path: string): Promise<string> {
  const hashFunc = createHash('sha512')
  try {
    hashFunc.update(await readFile(path))
    return hashFunc.digest('base64')
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return 'n/a'
    } else {
      throw error
    }
  }
}

export async function updateHashes(): Promise<void> {
  const hashes = Object.fromEntries(
    await Promise.all(configPaths.map(async (path) => [path, await fileHash(path)]))
  )
  writeState('install', hashes)
}

async function hasConfigChanged(logger: Logger): Promise<boolean> {
  const hashes = readState('install')
  if (!hashes) {
    return true
  }
  for (const [path, prevHash] of Object.entries(hashes)) {
    const newHash = await fileHash(path)
    if (newHash !== prevHash) {
      logger.debug(`hash for path ${path} has changed, running hook checks`)
      return true
    }
  }
  return false
}

export async function checkInstall(logger: Logger, config: ValidConfig): Promise<void> {
  if (!(await hasConfigChanged(logger))) {
    return
  }

  const hooks = unwrapValidated(await loadHooks(logger, config), 'hooks are invalid')

  const uninstalledHooks = await asyncFilter(hooks, async (hook) => {
    return !(await hook.check())
  })

  if (uninstalledHooks.length > 0) {
    const error = new ToolKitError('There are problems with your Tool Kit installation.')
    error.details = formatUninstalledHooks(uninstalledHooks)
    throw error
  }

  await updateHashes()
}

export const createConfig = (): RawConfig => ({
  root: coreRoot,
  plugins: {},
  resolvedPlugins: new Set(),
  tasks: {},
  commandTasks: {},
  options: {},
  hooks: {},
  hookOptions: {}
})

async function asyncFilter<T>(items: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const results = await Promise.all(items.map(async (item) => ({ item, keep: await predicate(item) })))

  return results.filter(({ keep }) => keep).map(({ item }) => item)
}

export function validateConfig(config: ValidPluginsConfig, logger: Logger): ValidConfig {
  const validConfig = config as ValidConfig

  const commandTaskConflicts = findConflicts(Object.values(config.commandTasks))
  const hookConflicts = findConflictingEntries(config.hooks)
  const taskConflicts = findConflictingEntries(config.tasks)
  const optionConflicts = findConflicts(Object.values(config.options))
  const hookOptionConflicts = findConflicts(Object.values(config.hookOptions))

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
    optionConflicts.length > 0 ||
    hookOptionConflicts.length > 0
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

    if (hookOptionConflicts.length) {
      error.details += formatHookOptionConflicts(hookOptionConflicts)
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

  const invalidOptions: InvalidOption[] = []
  for (const [id, plugin] of Object.entries(config.plugins)) {
    const pluginId = id as keyof SchemaOptions
    const pluginOptions = config.options[pluginId]
    if (pluginOptions && isConflict(pluginOptions)) {
      continue
    }

    const pluginSchema = Schemas[pluginId]
    if (!pluginSchema) {
      logger.silly(`skipping validation of ${pluginId} plugin as no schema can be found`)
      continue
    }
    const result = pluginSchema.safeParse(pluginOptions?.options ?? {})
    if (result.success) {
      // Set up options entry for plugins that don't have options specified
      // explicitly. They could still have default options that are set by zod.
      if (!pluginOptions) {
        // TypeScript struggles with this type as it sees one side as
        // `Foo<a | b | c>` and the other as `Foo<a> | Foo<b> | Foo<c>` for
        // some reason (something to do with the record indexing) and it can't
        // unify them. But they are equivalent so let's force it with a cast.
        config.options[pluginId] = {
          options: result.data,
          plugin: config.plugins['app root'],
          forPlugin: plugin
        } as any // eslint-disable-line @typescript-eslint/no-explicit-any
      } else {
        pluginOptions.options = result.data
      }
    } else {
      invalidOptions.push([id, result.error])
    }
  }
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

export function validatePlugins(config: RawConfig): Validated<ValidPluginsConfig> {
  const validatedPlugins = reduceValidated(
    Object.entries(config.plugins).map(([id, plugin]) => mapValidated(plugin, (p) => [id, p] as const))
  )
  return mapValidated(validatedPlugins, (plugins) => ({ ...config, plugins: Object.fromEntries(plugins) }))
}

export function loadConfig(logger: Logger, options?: { validate?: true }): Promise<ValidConfig>
export function loadConfig(logger: Logger, options?: { validate?: false }): Promise<RawConfig>

export async function loadConfig(logger: Logger, { validate = true } = {}): Promise<ValidConfig | RawConfig> {
  const config = createConfig()

  // start loading config and child plugins, starting from the consumer app directory
  const rootPlugin = await loadPlugin('app root', config, logger)
  const validRootPlugin = unwrapValidated(rootPlugin, 'root plugin was not valid!')

  const validatedPluginConfig = validatePlugins(config)
  const validPluginConfig = unwrapValidated(validatedPluginConfig, 'config was not valid!')

  // collate root plugin and descendent hooks, options etc into config
  resolvePlugin(validRootPlugin, validPluginConfig, logger)

  return validate ? validateConfig(validPluginConfig, logger) : config
}
