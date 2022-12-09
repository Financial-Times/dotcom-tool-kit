import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import importCwd from 'import-cwd'
import type { Spinner } from 'komatsu'
import Komatsu from 'komatsu'

export type LoggerError = Error & {
  logged?: boolean
}

export type labels = {
  waiting: string
  pending: string
  done: string
  fail: string
}

// TODO backport this to Komatsu mainline?
export class Logger extends Komatsu {
  stop(): void {
    if (
      !Array.from(this.spinners.values()).some(
        (spinner: Spinner | { status: 'not-started' }) => spinner.status === 'not-started'
      )
    )
      super.stop()
  }

  renderSymbol(spinner: Spinner | { status: 'not-started' }): string {
    if (spinner.status === 'not-started') {
      return '-'
    }

    return super.renderSymbol(spinner)
  }

  async logPromiseWait<T>(wait: Promise<T>, labels: labels): Promise<{ interim: T; id: string }> {
    const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
      .toString(36)
      .padStart(6, '0')

    this.log(id, { message: labels.waiting, status: 'not-started' })

    let interim
    try {
      interim = await wait
    } catch (error) {
      const loggerError = error as LoggerError
      // should have been logged by logPromise
      loggerError.logged = true
      throw error
    }

    return { interim, id }
  }
}

export function hasToolKitConflicts(error: unknown): boolean {
  try {
    // we need to import hasToolkitConflicts from the app itself instead of npx
    // or else hasToolkitConflicts and ToolKitConflictError will come from npx
    // but the error will come from the app level, leading to the error failing
    // the instanceof ToolKitConflictError check
    const errorModule = importCwd('@dotcom-tool-kit/error') as typeof ToolkitErrorModule
    return errorModule.hasToolKitConflicts(error)
  } catch {
    // if the error package isn't found then that probably means npm install
    // has failed and we should be logging out that error
    return false
  }
}

export async function runTasksWithLogger<T, U>(
  logger: Logger,
  wait: Promise<T>,
  run: (interim: T) => Promise<U>,
  label: string,
  allowConflicts: boolean
): Promise<U> {
  const labels: labels = {
    waiting: `not ${label} yet`,
    pending: label,
    done: `finished ${label}`,
    fail: `error with ${label}`
  }

  const { interim, id } = await logger.logPromiseWait(wait, labels)

  try {
    logger.log(id, { message: labels.pending })

    const result = await run(interim)
    logger.log(id, { status: 'done', message: labels.done })
    return result
  } catch (error) {
    const loggerError = error as LoggerError
    // hack to suppress error when installHooks promise fails seeing as it's
    // recoverable
    if (allowConflicts && hasToolKitConflicts(error)) {
      logger.log(id, { status: 'done', message: 'finished installing hooks, but found conflicts' })
    } else {
      logger.log(id, {
        status: 'fail',
        message: labels.fail,
        error: loggerError.logged ? undefined : loggerError
      })
    }

    loggerError.logged = true
    throw loggerError
  }
}
