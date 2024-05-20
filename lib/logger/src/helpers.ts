import { ChildProcess } from 'child_process'
import { Readable, Transform } from 'stream'
import { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { rootLogger } from './logger'
import { styles as s } from './styles'
import { HookTransport, consoleTransport } from './transports'
import ansiRegex from 'ansi-regex'

const ansiRegexText = ansiRegex().source
const whitespaceRegex = /\s|\n/g
const startRegex = new RegExp(`^(?:(?:${ansiRegexText})|\s|\n)+`)
const endRegex = new RegExp(`(?:(?:${ansiRegexText})|\s|\n)+$`)

// RIS escape code to effectively do a clear (^L) on the terminal. TypeScript's
// watch mode does this and it's annoying to have the logs shunted around when
// tracking multiple tasks.
const ansiReset = /\x1Bc/g

// Trim whitespace whilst preserving ANSI escape codes
function ansiTrim(message: string): string {
  let start = 0
  let ansiStart = ''
  const startResult = message.match(startRegex)
  if (startResult !== null) {
    ansiStart = startResult[0]
    start = ansiStart.length
  }
  let end
  let ansiEnd = ''
  const endResult = message.match(endRegex)
  if (endResult !== null) {
    ansiEnd = endResult[0]
    end = -ansiEnd.length
  }
  return (
    ansiStart.replace(whitespaceRegex, '') + message.slice(start, end) + ansiEnd.replace(whitespaceRegex, '')
  )
}

// Remove ANSI escape codes that mess with the terminal state. This selectively
// only deletes escape codes we've seen causing issues so that other
// functionality (particularly colouring) passes through fine.
function stripAnsiReset(message: string): string {
  return message.replace(ansiReset, '')
}

// Collection of functions to make the hooked logs more readable, especially
// when multiple tasks are running in a Tool Kit hook
function cleanupLogs(message: string): string {
  return stripAnsiReset(ansiTrim(message))
}

// This function hooks winston into console.log statements. Most useful for when
// calling functions from external libraries that you expect will do their own
// logging.
export function hookConsole(logger: Logger, processName: string): () => void {
  function wrapWrite(stream: NodeJS.WriteStream, level: string): NodeJS.WriteStream['write'] {
    const { write: originalWrite } = stream

    stream.write = (message: string, encoding?, writeCallback?) => {
      // HACK: allow winston logs from other threads to go straight through
      if (message.startsWith('[')) {
        if (typeof encoding === 'function') {
          return originalWrite(message, encoding)
        } else {
          return originalWrite(message, encoding, writeCallback as (err?: Error) => void)
        }
      } else {
        if (typeof encoding === 'function') {
          writeCallback = encoding
        }
        logger.log(level, cleanupLogs(message), { process: processName, writeCallback })
        return true
      }
    }

    return originalWrite
  }

  // TODO: make this thread-safe?
  const stdoutWrite = wrapWrite(process.stdout, 'info')
  const stderrWrite = wrapWrite(process.stderr, 'warn')

  const hook = (message: string, writeCallback: () => void) => {
    stdoutWrite.call(process.stdout, message + '\n', 'utf8', writeCallback)
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
export function hookFork(
  logger: Logger,
  process: string,
  child: Pick<ChildProcess, 'stdout' | 'stderr'>,
  logStdErr = true
): void {
  function hookStream(stream: Readable, level: string) {
    stream.setEncoding('utf8')
    stream
      .pipe(
        new Transform({
          decodeStrings: false,
          readableObjectMode: true,
          transform: (message, _enc, callback) => {
            // add the log level and wrap the message for the winston stream to
            // consume. we preserve newlines here as, unlike other cases, this
            // logger can be called in the middle of a line depending on when
            // the stream is flushed.
            callback(null, { level, message: stripAnsiReset(message) })
          }
        })
      )
      .pipe(logger.child({ process }), { end: false })
  }

  if (!child.stdout) {
    const error = new ToolKitError(`failed to hook into forked ${process} process`)
    error.details = `Did you make sure to pipe the stdout to the parent, such as by setting ${s.dim(
      '{ silent: true }'
    )} in ${s.dim('fork')}?`
    throw error
  }
  hookStream(child.stdout, 'info')
  if (logStdErr && child.stderr) {
    hookStream(child.stderr, 'warn')
  }
}

// Wait for a child process to finish, returning successfully if they terminate
// with an exit code of 0, else throwing an error with the contents of their
// stderr as the error details.
export function waitOnExit(process: string, child: ChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    child.on('error', (error) => {
      reject(error)
    })
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new ToolKitError(
          `${process} process ${
            code ? `returned a non-zero exit code (${code})` : `was terminated by a ${signal} signal`
          }`
        )
        error.details = 'error output has been logged above ☝️'
        error.exitCode = code ?? undefined
        reject(error)
      }
    })
  })
}
