import winston from 'winston'
import { createFormatter } from './format'
import { consoleTransport } from './transports'

export const rootLogger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (process.env.CIRCLECI ? 'verbose' : 'info'),
  transports: [consoleTransport]
})
rootLogger.format = createFormatter(rootLogger)
