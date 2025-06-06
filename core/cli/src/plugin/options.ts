import { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { isConflict } from '@dotcom-tool-kit/conflict'
import { OptionsForPlugin, RCFile, type Plugin } from '@dotcom-tool-kit/plugin'
import { RootSchema } from '@dotcom-tool-kit/plugin/lib/root-schema'
// HACK:IM:20250217 preserve backwards compatibility with older plugins without
// a colocated schema by falling back to the now-deleted schemas library if no
// schema found
import { type PluginOptions, PluginSchemas, legacyPluginOptions } from '@dotcom-tool-kit/schemas'
import { invalid, reduceValidated, valid, Validated } from '@dotcom-tool-kit/validated'

import type { Logger } from 'winston'
import * as z from 'zod'
import { styles } from '@dotcom-tool-kit/logger'

import { toolKitIfDefinedIdent, toolKitOptionIdent } from '../rc-file'
import { InvalidOption } from '../messages'
import { importSchemaEntryPoint } from './entry-point'

export const validatePluginOptions = async (
  logger: Logger,
  config: ValidPluginsConfig
): Promise<InvalidOption[]> => {
  const invalidOptions: InvalidOption[] = []

  for (const [id, plugin] of Object.entries(config.plugins)) {
    const pluginOptions = config.pluginOptions[id]
    if (pluginOptions && isConflict(pluginOptions)) {
      continue
    }

    let pluginSchema: z.ZodSchema | undefined
    const schemaEntrypoint = plugin.rcFile?.optionsSchema
    if (schemaEntrypoint) {
      const schema = await importSchemaEntryPoint({ plugin, modulePath: schemaEntrypoint })
      if (!schema.valid) {
        invalidOptions.push([
          id,
          new z.ZodError([
            {
              message: schema.reasons.join('\n'),
              code: z.ZodIssueCode.custom,
              path: []
            }
          ])
        ])
        continue
      }
      pluginSchema = schema.value
    } else if (id === 'app root') {
      pluginSchema = RootSchema
    } else {
      pluginSchema = PluginSchemas[id as keyof PluginOptions]
    }

    if (!pluginSchema) {
      logger.silly(`skipping validation of ${id} plugin as no schema can be found`)

      // TODO:KB:20240412 remove legacyPluginOptions in a future major version
      if (pluginOptions && id in legacyPluginOptions) {
        const movedToTask = legacyPluginOptions[id]
        invalidOptions.push([
          id,
          new z.ZodError([
            {
              message: `options for the ${styles.plugin(id)} plugin have moved to ${styles.code(
                `options.tasks.${styles.task(movedToTask)}`
              )}`,
              code: z.ZodIssueCode.custom,
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
        config.pluginOptions[id] = {
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
  const validateTagPath = (path: (string | number)[]): string | void => {
    if (path[0] === 'options' && path[1] === 'plugins') {
      return `YAML tag referencing options used at path '${path.join('.')}'`
    }
  }

  // recursively walk through the parsed config, searching for the tag
  // identifiers we've inserted during parsing, and substitute them for
  // resolved option values
  const deeplySubstitute = (node: unknown, path: (string | number)[]): Validated<unknown> => {
    if (Array.isArray(node)) {
      return reduceValidated(node.map((item, i) => deeplySubstitute(item, [...path, i])))
    } else if (node && typeof node === 'object') {
      const entries: [string, unknown][] = Object.entries(node)
      const substituted: Validated<[string, unknown]>[] = []
      for (const entry of entries) {
        const subbedEntry = reduceValidated(
          // allow both keys and values to be substituted by options
          entry.map((val, i) => {
            const isKey = i === 0
            if (typeof val === 'string' && val.startsWith(toolKitOptionIdent)) {
              // check the tag path each time so that we can have a separate
              // error for each incorrect use of the tag
              const validationError = validateTagPath([...path, entry[0]])
              if (validationError) {
                return invalid([validationError])
              } else {
                // the option path is concatenated after the !toolkit/option
                // identifier
                const optionPath = val.slice(toolKitOptionIdent.length)
                const resolvedOption = resolveOptionPath(optionPath)
                if (isKey && typeof resolvedOption !== 'string') {
                  return invalid([
                    `Option '${optionPath}' for the key at path '${path.join(
                      '.'
                    )}' does not resolve to a string (resolved to ${resolvedOption})`
                  ])
                } else {
                  return valid(resolvedOption)
                }
              }
            } else {
              return valid(val)
            }
          })
        ) as Validated<[string, unknown]>
        if (!subbedEntry.valid) {
          substituted.push(subbedEntry)
          continue
        }

        const [key, value] = subbedEntry.value
        if (key.startsWith(toolKitIfDefinedIdent)) {
          const validationError = validateTagPath(path)
          if (validationError) {
            substituted.push(invalid([validationError]))
          }
          // the option path is concatenated after the !toolkit/if-defined
          // identifier
          const optionPath = key.slice(toolKitIfDefinedIdent.length)
          const optionValue = resolveOptionPath(optionPath)
          // keep walking the path if we've found an error here so we can
          // gather even more errors to show the user. else skip traversal if
          // we aren't going to include the node
          if (optionValue || validationError) {
            const subbedValues = deeplySubstitute(value, path)
            if (subbedValues.valid) {
              substituted.push(...Object.entries(subbedValues.value as object).map((v) => valid(v)))
            } else {
              // safe to cast as invalid objects don't need to match the inner
              // type
              substituted.push(subbedValues as Validated<[string, unknown]>)
            }
          }
        } else {
          substituted.push(deeplySubstitute(value, [...path, key]).map((subbedValue) => [key, subbedValue]))
        }
      }
      return reduceValidated(substituted).map(Object.fromEntries)
    } else {
      return valid(node)
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
    plugin.rcFile = deeplySubstitute(plugin.rcFile, []).unwrap(
      `error when subsituting options (i.e., resolving ${styles.code('!toolkit/option')} and ${styles.code(
        '!toolkit/if-defined'
      )} tags)`
    ) as RCFile
  }
  config.resolutionTrackers.substitutedPlugins.add(plugin.id)
}
