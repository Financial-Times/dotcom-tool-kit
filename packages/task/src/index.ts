export abstract class Task<O extends Record<string, unknown> = Record<string, unknown>> {
  static hidden: boolean
  static description: string

  constructor(public options: O) {}

  abstract run(): Promise<void>
}
