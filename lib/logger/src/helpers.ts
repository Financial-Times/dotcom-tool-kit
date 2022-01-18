import { ChildProcess } from 'child_process'
import { Transform } from 'stream'
import { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { rootLogger } from './logger'
import { HookTransport, consoleTransport } from './transports'

// This function hooks winston into console.log statements. Most useful for when
// calling functions from external libraries that you expect will do their own
// logging.
export function hookConsole(logger: Logger, processName: string): () => void {
  function writeShim(level: string): NodeJS.WriteStream['write'] {
    return (message: string, encoding?, writeCallback?) => {
      if (typeof encoding === 'function') {
        writeCallback = encoding
      }
      logger.log(level, message, { process: processName, writeCallback })
      return true
    }
  }

  // TODO make this thread-safe?
  const { write: stdoutWrite } = process.stdout
  process.stdout.write = writeShim('info')
  const { write: stderrWrite } = process.stderr
  process.stderr.write = writeShim('warn')

  const hook = (message: string, writeCallback: () => void) => {
    stdoutWrite.call(process.stdout, message, 'utf8', writeCallback)
  }
  const hookTransport = new HookTransport({ hook })

  // Can only remove the transports from the logger you originally added them
  // to, not any child loggers
  rootLogger.remove(consoleTransport).add(hookTransport)

  return () => {
    process.stdout.write = stdoutWrite
    process.stderr.write = stderrWrite
    rootLogger.remove(hookTransport).add(consoleTransport)
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
          callback(null, { level: 'info', message: data.endsWith('\n') ? data.slice(0, -1) : data })
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
