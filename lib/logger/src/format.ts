import winston from 'winston'
import { styles } from './styles'

export const format = winston.format.printf((info) => {
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
    }

    if (info.level === 'error') {
      message = styles.error(message)
      labels = styles.errorHighlight(labels)
    } else if (info.level === 'warn') {
      message = styles.warning(message)
      labels = styles.warningHighlight(labels)
    }

    if (labels) {
      message = `${labels} ${message}`
    }
  }

  return message
})
