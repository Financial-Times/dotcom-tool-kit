import type { Logger } from 'winston'
import { initSymbol, typeSymbol } from './symbols'
import { Base } from './base'

export abstract class Init extends Base {
  logger: Logger

  constructor(logger: Logger, public id: string) {
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
