import winston from 'winston'
import { createFormatter } from './format.js'
import { consoleTransport } from './transports.js'

export const rootLogger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (process.env.CIRCLECI ? 'verbose' : 'info'),
  transports: [consoleTransport]
})
rootLogger.format = createFormatter(rootLogger)
