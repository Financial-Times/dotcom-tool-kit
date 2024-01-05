import type { RawConfig, ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { Validated, reduceValidated } from '@dotcom-tool-kit/validated'

export function validatePlugins(config: RawConfig): Validated<ValidPluginsConfig> {
  const validatedPlugins = reduceValidated(
    Object.entries(config.plugins).map(([id, plugin]) => plugin.map((p) => [id, p] as const))
  )
  return validatedPlugins.map((plugins) => ({ ...config, plugins: Object.fromEntries(plugins) }))
}
