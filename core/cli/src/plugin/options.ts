import { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { InvalidOption } from '../messages'
import { type PluginOptions, PluginSchemas } from '@dotcom-tool-kit/schemas'
import { isConflict } from '@dotcom-tool-kit/conflict'
import type { Logger } from 'winston'

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
