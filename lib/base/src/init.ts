import type { Logger } from 'winston'
import { initSymbol, typeSymbol } from './symbols'
import { Base } from './base'

export type InitContext = {
  cwd: string
}

export abstract class Init extends Base {
  logger: Logger

  constructor(logger: Logger) {
    super()
    this.logger = logger.child({ hook: this.constructor.name })
  }

  static get [typeSymbol](): symbol {
    return initSymbol
  }

  get [typeSymbol](): symbol {
    return initSymbol
  }

  abstract init(context: InitContext): Promise<void>
}

export type InitConstructor = {
  new (logger: Logger): Init
}

export type InitClass = InitConstructor & typeof Init
