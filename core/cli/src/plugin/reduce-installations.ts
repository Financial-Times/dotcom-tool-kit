import { Logger } from 'winston'
import { HookClass, HookInstallation, Plugin, ValidConfig } from '@dotcom-tool-kit/types'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import { groupBy } from 'lodash'
import { HookSchemas, HookOptions } from '@dotcom-tool-kit/schemas'

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
  if (!plugin.rcFile) {
    return []
  }

  const rawChildInstallations = await Promise.all(
    (plugin.children ?? []).map((child) => reducePluginHookInstallations(logger, config, hookClasses, child))
  ).then((installations) => installations.flat())

  const childInstallations = Object.entries(
    groupBy(rawChildInstallations, (installation) =>
      isConflict(installation) ? installation.conflicting[0].forHook : installation.forHook
    )
  ).flatMap(([forHook, installations]) => {
    const hookClass = hookClasses[forHook]

    return hookClass.mergeChildInstallations(plugin, installations)
  })

  if (plugin.rcFile.hooks.length === 0) {
    return childInstallations
  }

  return plugin.rcFile.hooks.flatMap((hookEntry) =>
    Object.entries(hookEntry).flatMap(([id, configHookOptions]) => {
      const hookClass = hookClasses[id]
      const parsedOptions = HookSchemas[id as keyof HookOptions].parse(configHookOptions)

      const installation: HookInstallation = {
        options: parsedOptions,
        plugin,
        forHook: id,
        hookConstructor: hookClass
      }

      return hookClass.overrideChildInstallations(plugin, installation, childInstallations)
    })
  )
}
