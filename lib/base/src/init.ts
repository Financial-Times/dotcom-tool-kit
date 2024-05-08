import type { Logger } from 'winston'
import { initSymbol, typeSymbol } from './symbols.js'
import { Base } from './base.js'

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

  abstract init(): Promise<void>
}

export type InitConstructor = {
  new (logger: Logger): Init
}

export type InitClass = InitConstructor & typeof Init
