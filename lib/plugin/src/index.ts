type TaskSpecWithOptions = Record<string, Record<string, unknown>>
type TaskSpec = string | TaskSpecWithOptions
type InstallsSpec = {
  entryPoint: string
  managesFiles?: string[]
}

export const CURRENT_RC_FILE_VERSION = 2

export type RCFile = {
  version?: typeof CURRENT_RC_FILE_VERSION
  plugins: string[]
  installs: { [id: string]: InstallsSpec }
  tasks: { [id: string]: string }
  commands: { [id: string]: TaskSpec | TaskSpec[] }
  hooks?: { [id: string]: TaskSpec | TaskSpec[] }
  options: {
    plugins: { [id: string]: Record<string, unknown> }
    tasks: { [id: string]: Record<string, unknown> }
    hooks: { [id: string]: Record<string, unknown> }[]
  }
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
  tasks: OptionsForTask[]
}

export interface OptionsForPlugin {
  options: Record<string, unknown>
  plugin: Plugin
  forPlugin: Plugin
}

export interface OptionsForTask {
  options: Record<string, unknown>
  plugin: Plugin
  task: string
}

export interface EntryPoint {
  plugin: Plugin
  modulePath: string
}
