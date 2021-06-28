export abstract class Command {
  static hidden: boolean
  static description: string

  argv: string[]
  options?: Record<string, unknown>

  constructor(argv: string[]) {
    this.argv = argv
  }

  abstract run(): Promise<void>
}
