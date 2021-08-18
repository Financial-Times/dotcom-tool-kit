export abstract class Task<O extends Record<string, unknown> = Record<string, unknown>> {
  static hidden: boolean
  static description: string
  static plugin?: any
  static id?: string

  constructor(public options: O) {}

  abstract run(): Promise<void>
}

export type TaskClass = typeof Task
