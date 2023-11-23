import type { Logger } from 'winston'
import { Base } from './base'
import { hookSymbol, typeSymbol } from './symbols'
import { z } from 'zod'

export abstract class Hook<Options extends z.ZodTypeAny = z.ZodTypeAny, State = void> extends Base {
  logger: Logger
  static description?: string
  id: string
  options: z.output<Options>
  // This field is used to collect hooks that share state when running their
  // install methods. All hooks in the same group will run their install method
  // one after the other, and then their commitInstall method will be run with
  // the collected state.
  installGroup?: string

  static get [typeSymbol](): symbol {
    return hookSymbol
  }

  get [typeSymbol](): symbol {
    return hookSymbol
  }

  constructor(logger: Logger, id: string, options: z.output<Options>) {
    super()

    this.id = id
    this.logger = logger.child({ hook: this.constructor.name })
    this.options = options
  }

  abstract check(): Promise<boolean>
  abstract install(state?: State): Promise<State>
  async commitInstall(_state: State): Promise<void> {
    return
  }
}

export type HookConstructor = { new (logger: Logger, id: string, options: z.output<z.ZodTypeAny>): Hook }

export type HookClass = HookConstructor & typeof Hook
