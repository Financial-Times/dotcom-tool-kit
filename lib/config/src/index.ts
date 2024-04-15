import type { Validated } from '@dotcom-tool-kit/validated'
import type {
  CommandTask,
  EntryPoint,
  Plugin,
  OptionsForPlugin,
  OptionsForTask
} from '@dotcom-tool-kit/plugin'
import type { PluginOptions } from '@dotcom-tool-kit/schemas'
import type { Conflict } from '@dotcom-tool-kit/conflict'

export interface RawConfig {
  root: string
  plugins: { [id: string]: Validated<Plugin> }
  resolvedPlugins: Set<string>
  tasks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  commandTasks: { [id: string]: CommandTask | Conflict<CommandTask> }
  pluginOptions: { [id: string]: OptionsForPlugin | Conflict<OptionsForPlugin> | undefined }
  taskOptions: { [id: string]: OptionsForTask | Conflict<OptionsForTask> | undefined }
  hooks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  inits: EntryPoint[]
}

export type ValidPluginsConfig = Omit<RawConfig, 'plugins'> & {
  plugins: { [id: string]: Plugin }
}

export type ValidOptionsForPlugin<Id extends keyof PluginOptions> = Omit<OptionsForPlugin, 'options'> & {
  options: PluginOptions[Id]
}

export type ValidPluginOptions = {
  [Id in keyof PluginOptions]: ValidOptionsForPlugin<Id>
}

export type ValidConfig = Omit<
  ValidPluginsConfig,
  'tasks' | 'commandTasks' | 'pluginOptions' | 'taskOptions' | 'hooks'
> & {
  tasks: { [id: string]: EntryPoint }
  commandTasks: { [id: string]: CommandTask }
  pluginOptions: ValidPluginOptions
  taskOptions: { [id: string]: OptionsForTask }
  hooks: { [id: string]: EntryPoint }
}
