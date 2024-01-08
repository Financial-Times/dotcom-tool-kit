import type { z } from 'zod'
import { Base } from './base'
import { taskSymbol, typeSymbol } from './symbols'
import type { Logger } from 'winston'

export abstract class Task<PluginOptions extends z.ZodTypeAny = z.ZodTypeAny> extends Base {
  static description: string

  static get [typeSymbol](): symbol {
    return taskSymbol
  }

  get [typeSymbol](): symbol {
    return taskSymbol
  }

  logger: Logger

  constructor(
    logger: Logger,
    public id: string,
    public pluginOptions: z.output<PluginOptions>
  ) {
    super()
    this.logger = logger.child({ task: id })
  }

  abstract run(files?: string[]): Promise<void>
}

export type TaskConstructor = {
  new <O extends z.ZodTypeAny>(logger: Logger, id: string, options: Partial<z.infer<O>>): Task<O>
}

export type TaskClass = TaskConstructor & typeof Task
