/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'lint-staged' {
  export interface LintStagedOptions {
    allowEmpty?: boolean
    concurrent?: boolean | number
    config?: any
    configPath?: string
    cwd?: string
    debug?: boolean
    maxArgLength?: number
    quiet?: boolean
    relative?: boolean
    shell?: boolean | string
    stash?: boolean
    verbose?: boolean
  }

  type LogFunction = (...params: any[]) => void
  type Logger = {
    error: LogFunction
    log: LogFunction
    warn: LogFunction
  }

  export default function lintStaged(opts?: LintStagedOptions, logger?: Logger): Promise<boolean>
}
