import { z } from 'zod'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import groupBy from 'lodash/groupBy'
import type { Logger } from 'winston'
import { loadConfig } from './config'
import { hasConfigChanged, updateHashes } from './config/hash'
import {
  Hook,
  HookClass,
  ValidConfig,
  Validated,
  invalid,
  reduceValidated,
  valid
} from '@dotcom-tool-kit/types'
import { reducePluginHookInstallations } from './plugin/reduce-installations'
import { findConflicts, withoutConflicts } from '@dotcom-tool-kit/types/src/conflict'
import { Options as HookSchemaOptions, HookSchemas } from '@dotcom-tool-kit/types/lib/hooks'
import { formatUninstalledHooks } from './messages'
import { importEntryPoint } from './plugin/entry-point'
import { runInit } from './init'

// implementation of the Array#some method that supports asynchronous predicates
async function asyncSome<T>(arr: T[], pred: (x: T) => Promise<boolean>): Promise<boolean> {
  for (const val of arr) {
    if (await pred(val)) {
      return true
    }
  }
  return false
}

// implementation of the Array#filter method that supports asynchronous predicates
async function asyncFilter<T>(items: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const results = await Promise.all(items.map(async (item) => ({ item, keep: await predicate(item) })))

  return results.filter(({ keep }) => keep).map(({ item }) => item)
}

const loadHookEntrypoints = async (
  logger: Logger,
  config: ValidConfig
): Promise<Validated<Record<string, HookClass>>> => {
  const hookResultEntries = reduceValidated(
    await Promise.all(
      Object.entries(config.hooks).map(async ([hookName, entryPoint]) => {
        const hookResult = await importEntryPoint(Hook, entryPoint)
        return hookResult.map((hookClass) => [hookName, hookClass as HookClass] as const)
      })
    )
  )

  return hookResultEntries.map((hookEntries) => Object.fromEntries(hookEntries))
}

export const loadHookInstallations = async (
  logger: Logger,
  config: ValidConfig
): Promise<Validated<Hook<z.ZodType, unknown>[]>> => {
  const hookClassResults = await loadHookEntrypoints(logger, config)
  const installationResults = await hookClassResults
    .map((hookClasses) =>
      reducePluginHookInstallations(logger, config, hookClasses, config.plugins['app root'])
    )
    .awaitValue()

  const installationsWithoutConflicts = installationResults.flatMap((installations) => {
    const conflicts = findConflicts(installations)

    if (conflicts.length) {
      return invalid<[]>([])
    }

    return valid(withoutConflicts(installations))
  })

  return installationsWithoutConflicts.map((installations) => {
    return installations.map(({ hookConstructor, forHook, options }) => {
      const schema = HookSchemas[forHook as keyof HookSchemaOptions]
      const parsedOptions = schema ? schema.parse(options) : {}
      return new hookConstructor(logger, forHook, parsedOptions)
    })
  })
}

export async function checkInstall(logger: Logger, config: ValidConfig): Promise<void> {
  if (!(await hasConfigChanged(logger))) {
    return
  }

  const hooks = (await loadHookInstallations(logger, config)).unwrap('hooks are invalid')

  const uninstalledHooks = await asyncFilter(hooks, async (hook) => {
    return !(await hook.isInstalled())
  })

  if (uninstalledHooks.length > 0) {
    const error = new ToolKitError('There are problems with your Tool Kit installation.')
    error.details = formatUninstalledHooks(uninstalledHooks)
    throw error
  }

  await updateHashes()
}

export default async function installHooks(logger: Logger): Promise<ValidConfig> {
  const config = await loadConfig(logger)

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  await runInit(logger, config)

  const errors: Error[] = []
  const hooks = (await loadHookInstallations(logger, config)).unwrap('hooks are invalid')

  // group hooks without an installGroup separately so that their check()
  // method runs independently
  const groups = groupBy(hooks, (hook) => hook.installGroup ?? '__' + hook.id)

  for (const group of Object.values(groups)) {
    try {
      if (await asyncSome(group, async (hook) => !(await hook.isInstalled()))) {
        let state = undefined
        for (const hook of group) {
          state = await hook.install(state)
        }
        if (state) {
          try {
            await group[0].commitInstall(state)
          } catch (err) {
            if (err instanceof Error) {
              errors.push(err)
            } else {
              throw err
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        errors.push(err)
      } else {
        throw err
      }
    }
  }

  if (errors.length) {
    const error = new ToolKitError('could not automatically install hooks:')
    error.details = errors.map((error) => `- ${error.message}`).join('\n')
    throw error
  }

  await updateHashes()

  return config
}
