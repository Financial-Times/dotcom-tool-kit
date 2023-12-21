import type { Conflict } from './conflict'
import type { Validated } from './validated'
import type { Options as SchemaOptions } from './plugins'

export * from './validated'
export * from './base'
export * from './task'
export * from './hook'
export * from './init'

export type RCFile = {
  plugins: string[]
  installs: { [id: string]: string }
  tasks: { [id: string]: string }
  commands: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
  hooks: { [id: string]: Record<string, unknown> }[]
  init: string[]
}

export interface Plugin {
  id: string
  root: string
  rcFile?: RCFile
  parent?: Plugin
  children?: Plugin[]
}

export interface CommandTask {
  id: string
  plugin: Plugin
  tasks: string[]
}

export interface PluginOptions {
  options: Record<string, unknown>
  plugin: Plugin
  forPlugin: Plugin
}

export interface EntryPoint {
  plugin: Plugin
  modulePath: string
}

export interface RawConfig {
  root: string
  plugins: { [id: string]: Validated<Plugin> }
  resolvedPlugins: Set<string>
  tasks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  commandTasks: { [id: string]: CommandTask | Conflict<CommandTask> }
  options: { [id: string]: PluginOptions | Conflict<PluginOptions> | undefined }
  hooks: { [id: string]: EntryPoint | Conflict<EntryPoint> }
  inits: EntryPoint[]
}

export type ValidPluginsConfig = Omit<RawConfig, 'plugins'> & {
  plugins: { [id: string]: Plugin }
}

export type ValidPluginOptions<Id extends keyof SchemaOptions> = Omit<PluginOptions, 'options'> & {
  options: SchemaOptions[Id]
}

export type ValidOptions = {
  [Id in keyof SchemaOptions]: ValidPluginOptions<Id>
}

export type ValidConfig = Omit<ValidPluginsConfig, 'tasks' | 'commandTasks' | 'options' | 'hooks'> & {
  tasks: { [id: string]: EntryPoint }
  commandTasks: { [id: string]: CommandTask }
  options: ValidOptions
  hooks: { [id: string]: EntryPoint }
}
