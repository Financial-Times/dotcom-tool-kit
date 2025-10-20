import { groupBy } from 'lodash'
import type { Logger } from 'winston'
import * as z from 'zod'

import type { HookClass, HookInstallation } from '@dotcom-tool-kit/base'
import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import { styles } from '@dotcom-tool-kit/logger'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import { HookSchemas } from '@dotcom-tool-kit/schemas'
import { Validated, invalid, reduceValidated, valid } from '@dotcom-tool-kit/validated'

import { formatInvalidOption, formatUnusedHookOptions } from '../messages'

export interface HookModule {
  hookClass: HookClass
  schema?: z.ZodTypeAny
}

const extractForHook = (installation: HookInstallation | Conflict<HookInstallation>): string =>
  isConflict(installation) ? installation.conflicting[0].forHook : installation.forHook

// this function recursively collects all the hook installation requests from all plugins,
// and merges them into a single, flat array of HookInstallation objects and/or Conflicts.
//
// it works depth-first (i.e. recurses into child plugins first), and considers how to
// merge options or create conflicts in two stages: 1) when considering all installations
// from child plugins, and 2) when considering how a parent plugin would override its
// children. these steps are separate as a particular parent might not provide an override
// for all its children, and different hooks could expect different ways of resolving
// conflicts.
//
// the actual logic for this is delegated to static methods on Hook classes,
// `Hook.mergeChildInstallations` and `Hook.overrideChildInstallations`, so separate hooks
// can provide different logic for these steps.
//
// the default logic in the base Hook class is to always consider multiple installations
// from child plugins as a conflict, and always consider a installation in a parent as
// completely replacing any installations from children.
//
// for example, for a plugin `p` that depends on children `a`, `b`, and `c` that all provide
// configuration for the `PackageJson` hook, this function will:
//   - do all this logic for `a`, `b`, and `c`
//   - call `Hook.mergeChildInstallations` with the appropriate concrete Hook class, and
//     the resulting installations and/or conflicts from `a`, `b`, and `c`
//   - call `Hook.overrideChildInstallations` with the appropriate concrete Hook class, and

//     the resulting installations and/or conflicts from `Hook.mergeChildInstallations` and `p`
export function reducePluginHookInstallations(
  logger: Logger,
  config: ValidConfig,
  hookModules: Record<string, HookModule>,
  plugin: Plugin
): Validated<(HookInstallation | Conflict<HookInstallation>)[]> {
  if (!plugin.rcFile || config.resolutionTrackers.reducedInstallationPlugins.has(plugin.id)) {
    return valid([])
  }
  config.resolutionTrackers.reducedInstallationPlugins.add(plugin.id)

  const rawChildInstallations = reduceValidated(
    (plugin.children ?? []).map((child) => reducePluginHookInstallations(logger, config, hookModules, child))
  ).map((installations) => installations.flat())

  if (!rawChildInstallations.valid) {
    return rawChildInstallations
  }

  const childInstallations = Object.entries(groupBy(rawChildInstallations.value, extractForHook)).flatMap(
    ([forHook, installations]) => {
      const { hookClass } = hookModules[forHook]

      return hookClass.mergeChildInstallations(plugin, installations)
    }
  )

  if (plugin.rcFile.options.hooks.length === 0) {
    return valid(childInstallations)
  }
  const pluginHookIds = plugin.rcFile.options.hooks.flatMap(Object.keys)
  const unusedHookOptions = pluginHookIds
    .filter((hookId) => !(hookId in hookModules))
    .map((hookId) => styles.hook(hookId))
  if (unusedHookOptions.length > 0) {
    return invalid([formatUnusedHookOptions(unusedHookOptions, Object.keys(hookModules))])
  }

  const validatedInstallations = plugin.rcFile.options.hooks.flatMap((hookEntry) =>
    Object.entries(hookEntry).map<Validated<(HookInstallation | Conflict<HookInstallation>)[]>>(
      ([id, configHookOptions]) => {
        const hookModule = hookModules[id]
        const parsedOptions = (
          hookModule.schema ?? (HookSchemas as Record<string, z.ZodSchema | undefined>)[id]
        )?.safeParse(configHookOptions)
        if (parsedOptions && !parsedOptions.success) {
          return invalid([formatInvalidOption([styles.hook(id), parsedOptions.error])])
        }

        const installation: HookInstallation = {
          options: parsedOptions?.data ?? configHookOptions,
          plugin,
          forHook: id,
          hookConstructor: hookModule.hookClass
        }

        const childInstallationsForHook = childInstallations.filter(
          (childInstallation) => id === extractForHook(childInstallation)
        )
        return valid(
          hookModule.hookClass.overrideChildInstallations(plugin, installation, childInstallationsForHook)
        )
      }
    )
  )
  return reduceValidated(validatedInstallations).map((installations) => [
    ...installations.flat(),
    ...childInstallations.filter(
      (childInstallation) => !pluginHookIds.includes(extractForHook(childInstallation))
    )
  ])
}
