import type { Validated } from '@dotcom-tool-kit/validated'
import type { EntryPoint, CommandTask, OptionsForPlugin, Plugin } from '@dotcom-tool-kit/plugin'
import type { SchemaOptions } from '@dotcom-tool-kit/schemas'
import type { Conflict } from '@dotcom-tool-kit/conflict'

export interface RawConfig {
  root: string
  plugins: { [id: string]: Validated<Plugin> }
  resolvedPlugins: Set<string>
  tasks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  commandTasks: { [id: string]: CommandTask | Conflict<CommandTask> }
  pluginOptions: { [id: string]: OptionsForPlugin | Conflict<OptionsForPlugin> | undefined }
  hooks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  inits: EntryPoint[]
}

export type ValidPluginsConfig = Omit<RawConfig, 'plugins'> & {
  plugins: { [id: string]: Plugin }
}

export type ValidPluginOptions<Id extends keyof SchemaOptions> = Omit<OptionsForPlugin, 'options'> & {
  options: SchemaOptions[Id]
}

export type ValidOptions = {
  [Id in keyof SchemaOptions]: ValidPluginOptions<Id>
}

export type ValidConfig = Omit<ValidPluginsConfig, 'tasks' | 'commandTasks' | 'pluginOptions' | 'hooks'> & {
  tasks: { [id: string]: EntryPoint }
  commandTasks: { [id: string]: CommandTask }
  pluginOptions: ValidOptions
  hooks: { [id: string]: EntryPoint }
}
