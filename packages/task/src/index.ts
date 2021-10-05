import { Schema, SchemaOutput } from '@dotcom-tool-kit/types/lib/schema'

export abstract class Task<O extends Schema = Record<string, never>> {
  static description: string
  // plugin is set by the CLI package to a type it defines.
  // we could extract it into a package, but for now:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static plugin?: any
  static id?: string

  static defaultOptions: Record<string, unknown> = {}
  options: SchemaOutput<O>

  constructor(options: Partial<SchemaOutput<O>> = {}) {
    this.options = Object.assign(
      {},
      (this.constructor as typeof Task).defaultOptions as SchemaOutput<O>,
      options
    )
  }

  abstract run(): Promise<void>
}

export type TaskClass = typeof Task
