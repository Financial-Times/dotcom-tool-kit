import winston from 'winston'
import { format } from './format'
import { consoleTransport } from './transports'

export const rootLogger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format,
  transports: [consoleTransport]
})
