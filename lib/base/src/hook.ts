import type { Logger } from 'winston'
import { Base } from './base'
import { hookSymbol, typeSymbol } from './symbols'
import type { z } from 'zod'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import type { Default } from './type-utils'

export interface HookInstallation<Options = Record<string, unknown>> {
  options: Options
  plugin: Plugin
  forHook: string
  hookConstructor: HookConstructor
}

export abstract class Hook<
  Options extends {
    hook?: z.ZodTypeAny
    plugin?: z.ZodTypeAny
  } = Record<never, never>,
  State = unknown
> extends Base {
  logger: Logger
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
    if (childInstallations.length === 1) {
      return childInstallations
    }

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

  constructor(
    logger: Logger,
    public id: string,
    public options: z.output<Default<Options['hook'], z.ZodObject<Record<string, never>>>>,
    public pluginOptions: z.output<Default<Options['plugin'], z.ZodObject<Record<string, never>>>>
  ) {
    super()
    this.logger = logger.child({ hook: this.constructor.name })
  }

  abstract isInstalled(): Promise<boolean>
  abstract install(state?: State): Promise<State>
  async commitInstall(_state: State): Promise<void> {
    return
  }
}

export type HookConstructor = {
  new <O extends { plugin: z.ZodTypeAny; hook: z.ZodTypeAny }>(
    logger: Logger,
    id: string,
    options: z.infer<O['hook']>,
    pluginOptions: z.infer<O['plugin']>
  ): Hook<O, unknown>
}

export type HookClass = HookConstructor & typeof Hook
