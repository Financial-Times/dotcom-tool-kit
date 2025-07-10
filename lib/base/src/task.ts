import type { z } from 'zod'
import { Base } from './base'
import { taskSymbol, typeSymbol } from './symbols'
import type { Logger } from 'winston'
import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Plugin } from '@dotcom-tool-kit/plugin'
import type { Default } from './type-utils'
import type { ReadonlyDeep } from 'type-fest'

export type TaskRunContext = {
  files?: string[]
  command: string
  cwd: string
  config: ReadonlyDeep<ValidConfig>
}

export abstract class Task<
  Options extends {
    plugin?: z.ZodTypeAny
    task?: z.ZodTypeAny
  } = Record<never, never>
> extends Base {
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
    public pluginOptions: z.output<Default<Options['plugin'], z.ZodObject<Record<string, never>>>>,
    public options: z.output<Default<Options['task'], z.ZodObject<Record<string, never>>>>,
    public plugin: Plugin
  ) {
    super()
    this.logger = logger.child({ task: id })
  }

  abstract run(runContext: TaskRunContext): Promise<void>

  // not abstract for default behaviour of doing nothing
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async stop(): Promise<void> {}
}

export type TaskConstructor = {
  new <O extends { plugin: z.ZodTypeAny; task: z.ZodTypeAny }>(
    logger: Logger,
    id: string,
    pluginOptions: Partial<z.infer<O['plugin']>>,
    options: Partial<z.infer<O['task']>>,
    plugin: Plugin
  ): Task<O>
}

export type TaskClass = TaskConstructor & typeof Task
