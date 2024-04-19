import { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { isConflict } from '@dotcom-tool-kit/conflict'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { OptionsForPlugin, RCFile, type Plugin } from '@dotcom-tool-kit/plugin'
import { type PluginOptions, PluginSchemas, legacyPluginOptions } from '@dotcom-tool-kit/schemas'

import type { Logger } from 'winston'
import { ZodError, ZodIssueCode } from 'zod'
import { styles } from '@dotcom-tool-kit/logger'

import { toolKitIfDefinedIdent, toolKitOptionIdent } from '../rc-file'
import { InvalidOption } from '../messages'

export const validatePluginOptions = (logger: Logger, config: ValidPluginsConfig): InvalidOption[] => {
  const invalidOptions: InvalidOption[] = []

  for (const [id, plugin] of Object.entries(config.plugins)) {
    const pluginId = id as keyof PluginOptions
    const pluginOptions = config.pluginOptions[pluginId]
    if (pluginOptions && isConflict(pluginOptions)) {
      continue
    }

    const pluginSchema = PluginSchemas[pluginId]

    if (!pluginSchema) {
      logger.silly(`skipping validation of ${pluginId} plugin as no schema can be found`)

      // TODO:KB:20240412 remove legacyPluginOptions in a future major version
      if (pluginOptions && pluginId in legacyPluginOptions) {
        const movedToTask = legacyPluginOptions[pluginId]
        invalidOptions.push([
          id,
          new ZodError([
            {
              message: `options for ${styles.plugin(id)} have moved to the ${styles.task(movedToTask)} task`,
              code: ZodIssueCode.custom,
              path: []
            }
          ])
        ])
      }

      continue
    }

    const result = pluginSchema.safeParse(pluginOptions?.options ?? {})
    if (result.success) {
      // Set up options entry for plugins that don't have options specified
      // explicitly. They could still have default options that are set by zod.
      if (!pluginOptions) {
        config.pluginOptions[pluginId] = {
          options: result.data,
          plugin: config.plugins['app root'],
          forPlugin: plugin
        }
      } else {
        pluginOptions.options = result.data
      }
    } else {
      invalidOptions.push([id, result.error])
    }
  }

  return invalidOptions
}

export const substituteOptionTags = (plugin: Plugin, config: ValidPluginsConfig): void => {
  // foo.bar gets the 'bar' option set for the 'foo' plugin
  const resolveOptionPath = (optionPath: string): unknown => {
    const [pluginName, optionName] = optionPath.split('.', 2)
    return (config.pluginOptions[pluginName] as OptionsForPlugin)?.options[optionName]
  }

  // throw an error if there are tags in plugin option fields to avoid circular
  // references
  const validateTagPath = (path: (string | number)[]) => {
    if (path[0] === 'options' && path[1] === 'plugins') {
      const error = new ToolKitError('cannot reference plugin options when specifying options')
      error.details = `YAML tag referencing options used at path '${path.join('.')}'`
      throw error
    }
  }

  // recursively walk through the parsed config, searching for the tag
  // identifiers we've inserted during parsing, and substitute them for
  // resolved option values
  const deeplySubstitute = (node: unknown, path: (string | number)[]): unknown => {
    if (Array.isArray(node)) {
      return node.map((item, i) => deeplySubstitute(item, [...path, i]))
    } else if (node && typeof node === 'object') {
      const entries = Object.entries(node)
      // !toolkit/option will be marked as a single entry within an object
      // e.g., { foo: { '__toolkit/option__': 'foo.bar' } }
      if (entries[0]?.[0] === toolKitOptionIdent) {
        validateTagPath(path)
        const optionPath = entries[0][1] as string
        return resolveOptionPath(optionPath)
      } else {
        const substituted: Record<string, unknown> = {}
        for (const [key, value] of entries) {
          if (key.startsWith(toolKitIfDefinedIdent)) {
            validateTagPath(path)
            // the option path is concatenated after the !toolkit/if-defined
            // identifier
            const optionPath = key.slice(toolKitIfDefinedIdent.length)
            const optionValue = resolveOptionPath(optionPath)
            if (optionValue) {
              Object.assign(substituted, deeplySubstitute(value, path))
            } // don't include the node if !optionValue
          } else {
            substituted[key] = deeplySubstitute(value, [...path, key])
          }
        }
        return substituted
      }
    } else {
      return node
    }
  }

  // avoid running substitution over a config repeatedly – all substitutions
  // will have been made in the first pass
  if (config.resolutionTrackers.substitutedPlugins.has(plugin.id)) {
    return
  }
  if (plugin.children) {
    for (const child of plugin.children) {
      substituteOptionTags(child, config)
    }
  }
  if (plugin.rcFile) {
    plugin.rcFile = deeplySubstitute(plugin.rcFile, []) as RCFile
  }
  config.resolutionTrackers.substitutedPlugins.add(plugin.id)
}
