export * from './validated'
export * from './base'
export * from './task'
export * from './hook'

export type RCFile = {
  plugins: string[]
  installs: { [id: string]: string }
  tasks: { [id: string]: string }
  commands: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
  hooks: { [id: string]: Record<string, unknown> }
}

export interface Plugin {
  id: string
  root: string
  rcFile?: RCFile
  parent?: Plugin
  children?: Plugin[]
}
