export abstract class Task<O extends Record<string, unknown> = Record<string, unknown>> {
  static hidden: boolean
  static description: string
  static plugin?: any
  static id?: string

  static defaultOptions: Record<string, unknown> = {}
  options: O

  constructor(options: Partial<O> = {}) {
    this.options = Object.assign({}, (this.constructor as typeof Task).defaultOptions as O, options)
  }

  abstract run(): Promise<void>
}

export type TaskClass = typeof Task
