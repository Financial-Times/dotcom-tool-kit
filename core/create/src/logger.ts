import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import importCwd from 'import-cwd'
import Logger from 'komatsu'

export type LoggerError = (Error | ToolkitErrorModule.ToolKitError) & {
  logged?: boolean
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

// helper function to include ToolKitError details in logs when available and,
// optionally, don't print errors when we get Tool Kit conflicts if we're
// expecting them
export async function catchToolKitErrorsInLogger<T>(
  logger: Logger,
  run: Promise<T>,
  label: string,
  allowConflicts: boolean
): Promise<T> {
  const labels = {
    pending: label,
    done: `finished ${label}`,
    fail: `error with ${label}`
  }

  const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
    .toString(36)
    .padStart(6, '0')

  try {
    logger.log(id, { message: labels.pending })

    const result = await run
    logger.log(id, { status: 'done', message: labels.done })
    return result
  } catch (error) {
    const loggerError = error as LoggerError
    // hack to suppress error when installHooks promise fails seeing as it's
    // recoverable
    if (allowConflicts && hasToolKitConflicts(error)) {
      logger.log(id, { status: 'done', message: 'finished installing hooks, but found conflicts' })
    } else {
      let message = labels.fail
      if ('details' in loggerError) {
        message += ' –\n' + loggerError.details
      }
      logger.log(id, {
        status: 'fail',
        message,
        error: loggerError.logged ? undefined : loggerError
      })
    }

    loggerError.logged = true
    throw loggerError
  }
}
