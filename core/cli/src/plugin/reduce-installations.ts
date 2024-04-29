import type { Logger } from 'winston'
import type { HookClass, HookInstallation } from '@dotcom-tool-kit/base'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import type { ValidConfig } from '@dotcom-tool-kit/config'
import { HookSchemas, HookOptions } from '@dotcom-tool-kit/schemas'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import { groupBy } from 'lodash'

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
export async function reducePluginHookInstallations(
  logger: Logger,
  config: ValidConfig,
  hookClasses: Record<string, HookClass>,
  plugin: Plugin
): Promise<(HookInstallation | Conflict<HookInstallation>)[]> {
  if (!plugin.rcFile || config.resolutionTrackers.reducedInstallationPlugins.has(plugin.id)) {
    return []
  }
  config.resolutionTrackers.reducedInstallationPlugins.add(plugin.id)

  const rawChildInstallations = await Promise.all(
    (plugin.children ?? []).map((child) => reducePluginHookInstallations(logger, config, hookClasses, child))
  ).then((installations) => installations.flat())

  const childInstallations = Object.entries(groupBy(rawChildInstallations, extractForHook)).flatMap(
    ([forHook, installations]) => {
      const hookClass = hookClasses[forHook]

      return hookClass.mergeChildInstallations(plugin, installations)
    }
  )

  if (plugin.rcFile.options.hooks.length === 0) {
    return childInstallations
  }

  return plugin.rcFile.options.hooks.flatMap((hookEntry) =>
    Object.entries(hookEntry).flatMap(([id, configHookOptions]) => {
      const hookClass = hookClasses[id]
      const parsedOptions = HookSchemas[id as keyof HookOptions].parse(configHookOptions)

      const installation: HookInstallation = {
        options: parsedOptions,
        plugin,
        forHook: id,
        hookConstructor: hookClass
      }

      const childInstallationsForHook = childInstallations.filter(
        (childInstallation) => id === extractForHook(childInstallation)
      )
      return hookClass.overrideChildInstallations(plugin, installation, childInstallationsForHook)
    })
  )
}
