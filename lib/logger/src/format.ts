import winston from 'winston'
import { styles } from './styles'

// This global variable is used to prevent the same label being printed
// multiple times in a row. Some processes (e.g., Jest) are prone to frequent
// stream flushing, causing their logs to be repeatedly interspersed with the
// labels, greatly hindering readability.
let lastLabel: string | undefined

export const createFormatter = (thisLogger: winston.Logger) =>
  winston.format.printf((info) => {
    let { message } = info

    if (!info.skipformat) {
      let labels = ''
      if (info.hook) {
        labels += `[${styles.hook(info.hook)}]`
      }
      if (info.task) {
        labels += `[${styles.task(info.task)}]`
      }
      if (info.process) {
        labels += `[${styles.dim(info.process)}]`
      } else {
        // simulate the newline present in a normal console.log (which we've
        // removed from the Console transport)
        message += '\n'
      }

      if (info.level === 'error') {
        labels = styles.errorHighlight(labels)
      } else if (info.level === 'warn') {
        labels = styles.warningHighlight(labels)
      }

      if (labels && labels !== lastLabel) {
        if (info.level === 'error') {
          message = styles.error(message)
        } else if (info.level === 'warn') {
          message = styles.warning(message)
        }
        // Put hooked messages on a new line so we don't break fancy layouts from
        // subprocesses, e.g., tables, with our metadata
        const delimiter = info.process ? '\n' : ' '
        message = `${labels}${delimiter}${message}`
      }
      // HACK: We only want to track the last label for logs that aren't
      // filtered out by winston. We need the logger to be instantiated before
      // creating this formatter function so that we can call a method on it to
      // check if the message will be filtered out or not.
      if (thisLogger.isLevelEnabled(info.level)) {
        lastLabel = labels
      }
    }

    return message
  })
