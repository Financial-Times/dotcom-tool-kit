import { ChildProcess } from 'child_process'
import hookStd from 'hook-std'
import { Transform } from 'stream'
import type { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'

// winston will add a newline itself
function trimTrailingNewline(message: string): string {
  return message.endsWith('\n') ? message.slice(0, -1) : message
}

// This function hooks winston into console.log statements. Most useful for when
// calling functions from external libraries that you expect will do their own
// logging.
export function hookConsole(logger: Logger, process: string): hookStd.Unhook {
  const { unhook: unhookStd } = hookStd.stderr({ silent: true }, (output) => {
    logger.info(trimTrailingNewline(output), { process })
  })
  const { unhook: unhookErr } = hookStd.stderr({ silent: true }, (output) => {
    logger.warn(trimTrailingNewline(output), { process })
  })

  return () => {
    unhookStd()
    unhookErr()
  }
}

// This function hooks winston into the stdout and stderr of child processes
// that we have spawned forked. Useful for when you need to invoke a CLI tool.
export function hookFork(logger: Logger, process: string, child: ChildProcess): void {
  if (!child.stdout) {
    throw new ToolKitError(`failed to fork ${process} process`)
  }
  child.stdout.setEncoding('utf8')
  child.stdout
    .pipe(
      new Transform({
        decodeStrings: false,
        readableObjectMode: true,
        transform: (data, _enc, callback) => {
          callback(null, { level: 'info', message: trimTrailingNewline(data) })
        }
      })
    )
    .pipe(logger.child({ process }), { end: false })
}

// Wait for a child process to finish, returning successfully if they terminate
// with an exit code of 0, else throwing an error with the contents of their
// stderr as the error details.
export function waitOnExit(process: string, child: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new ToolKitError(`${process} process returned an error`)
        child.stderr?.setEncoding('utf8')
        error.details = child.stderr?.read()
        reject(error)
      }
    })
  })
}
