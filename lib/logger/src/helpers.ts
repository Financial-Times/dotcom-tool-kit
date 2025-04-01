import { ChildProcess } from 'child_process'
import { Readable, Transform, Writable } from 'stream'
import { StringDecoder } from 'string_decoder'
import { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { rootLogger } from './logger'
import { styles as s } from './styles'
import { HookTransport, consoleTransport } from './transports'
import ansiRegex from 'ansi-regex'

const ansiRegexText = ansiRegex().source
const ansiOrWhitespaceRegexText = `(?:(?:${ansiRegexText})|\\n)+`
const startRegex = new RegExp(`^${ansiOrWhitespaceRegexText}`)
const endRegex = new RegExp(`${ansiOrWhitespaceRegexText}$`)

// RIS escape code to effectively do a clear (^L) on the terminal. TypeScript's
// watch mode does this and it's annoying to have the logs shunted around when
// tracking multiple tasks.
const ansiReset = /\x1Bc/g

// Trim newlines whilst preserving ANSI escape codes
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
  return ansiStart.replace('\n', '') + message.slice(start, end) + ansiEnd.replace('\n', '')
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

// This function converts a winston Logger into a Writable stream that can
// receive string data. Winston loggers already are a Writable stream but are
// in object mode so expect structured logs. This function converts a logger
// into a more flexible Writable that's not in object mode that you could use
// as the last argument to stream.pipeline, for example. Note that the passed
// logger will not be ended if the returned Writable is ended, as loggers tend
// to be longer lasting.
export function createWritableLogger(logger: Logger, process: string, level = 'info'): Writable {
  const decoder = new StringDecoder('utf8')
  const transform = new Transform({
    readableObjectMode: true,
    transform: (message, _enc, callback) => {
      // add the log level and wrap the message for the winston stream to
      // consume. we preserve newlines here as, unlike other cases, this
      // logger can be called in the middle of a line depending on when
      // the stream is flushed.
      callback(null, { level, message: stripAnsiReset(decoder.write(message)) })
    }
  })
  transform.pipe(logger.child({ process }), { end: false })
  return transform
}

// This function hooks winston into Reaable Node streams. Can be used when you
// want to log a stream's content.
export function hookStream(logger: Logger, process: string, stream: Readable, level = 'info') {
  stream.pipe(createWritableLogger(logger, process, level))
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
  if (!child.stdout) {
    const error = new ToolKitError(`failed to hook into forked ${process} process`)
    error.details = `Did you make sure to pipe the stdout to the parent, such as by setting ${s.dim(
      '{ silent: true }'
    )} in ${s.dim('fork')}?`
    throw error
  }
  hookStream(logger, process, child.stdout, 'info')
  if (logStdErr && child.stderr) {
    hookStream(logger, process, child.stderr, 'warn')
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
