import winston from 'winston'
import { format } from './format'
export { hookConsole, hookFork, waitOnExit } from './helpers'
export { styles } from './styles'

export function createLogger(): winston.Logger {
  return winston.createLogger({
    level: process.env.LOG_LEVEL,
    format,
    transports: [new winston.transports.Console()]
  })
}

export { format }
