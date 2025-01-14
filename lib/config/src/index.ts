import type { Validated } from '@dotcom-tool-kit/validated'
import type {
  CommandTask,
  EntryPoint,
  Plugin,
  OptionsForPlugin,
  OptionsForTask
} from '@dotcom-tool-kit/plugin'
import type { Conflict } from '@dotcom-tool-kit/conflict'

export interface RawConfig {
  root: string
  plugins: { [id: string]: Validated<Plugin> }
  resolutionTrackers: {
    resolvedPluginOptions: Set<string>
    substitutedPlugins: Set<string>
    resolvedPlugins: Set<string>
    reducedInstallationPlugins: Set<string>
  }
  tasks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  commandTasks: { [id: string]: CommandTask | Conflict<CommandTask> }
  pluginOptions: { [id: string]: OptionsForPlugin | Conflict<OptionsForPlugin> | undefined }
  taskOptions: { [id: string]: OptionsForTask | Conflict<OptionsForTask> | undefined }
  hooks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  inits: EntryPoint[]
  hookManagedFiles: Set<string>
}

export type ValidPluginsConfig = Omit<RawConfig, 'plugins'> & {
  plugins: { [id: string]: Plugin }
}

export type ValidConfig = Omit<
  ValidPluginsConfig,
  'tasks' | 'commandTasks' | 'pluginOptions' | 'taskOptions' | 'hooks'
> & {
  tasks: { [id: string]: EntryPoint }
  commandTasks: { [id: string]: CommandTask }
  pluginOptions: { [id: string]: OptionsForPlugin }
  taskOptions: { [id: string]: OptionsForTask }
  hooks: { [id: string]: EntryPoint }
}
