export type RCFile = {
  plugins: string[]
  installs: { [id: string]: string }
  tasks: { [id: string]: string }
  commands: { [id: string]: string | string[] }
  options: {
    plugins: { [id: string]: Record<string, unknown> }
    tasks: { [id: string]: Record<string, unknown> }
  }
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
