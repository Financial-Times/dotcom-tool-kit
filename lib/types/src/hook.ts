import type { Logger } from 'winston'
import { Base } from './base'
import { hookSymbol, typeSymbol } from './symbols'
import { z } from 'zod'
import { Plugin } from './index'
import { Conflict, isConflict } from './conflict'

export interface HookInstallation<Options = Record<string, unknown>> {
  options: Options
  plugin: Plugin
  forHook: string
  hookConstructor: HookConstructor
}

export abstract class Hook<Options extends z.ZodTypeAny = z.ZodTypeAny, State = void> extends Base {
  logger: Logger
  static description?: string
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

  static mergeChildInstallations(
    plugin: Plugin,
    childInstallations: (HookInstallation | Conflict<HookInstallation>)[]
  ): (HookInstallation | Conflict<HookInstallation>)[] {
    return [
      {
        plugin,
        conflicting: childInstallations.flatMap((installation) =>
          isConflict(installation) ? installation.conflicting : installation
        )
      }
    ]
  }

  static overrideChildInstallations(
    plugin: Plugin,
    parentInstallation: HookInstallation,
    _childInstallations: (HookInstallation | Conflict<HookInstallation>)[]
  ): (HookInstallation | Conflict<HookInstallation>)[] {
    return [parentInstallation]
  }

  constructor(logger: Logger, public id: string, public options: z.output<Options>) {
    super()
    this.logger = logger.child({ hook: this.constructor.name })
  }

  abstract isInstalled(): Promise<boolean>
  abstract install(state?: State): Promise<State>
  async commitInstall(_state: State): Promise<void> {
    return
  }
}

export type HookConstructor = { new (logger: Logger, id: string, options: z.output<z.ZodTypeAny>): Hook }

export type HookClass = HookConstructor & typeof Hook
