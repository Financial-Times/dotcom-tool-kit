import type { Spinner } from 'komatsu'
import Komatsu from 'komatsu'

export type LoggerError = Error & {
  logged?: boolean
}

export type labels = {
  waiting: string
  pending: string
  done: string
  fail: string
}

// TODO backport this to Komatsu mainline?
export class Logger extends Komatsu {
  stop(): void {
    if (
      !Array.from(this.spinners.values()).some(
        (spinner: Spinner | { status: 'not-started' }) => spinner.status === 'not-started'
      )
    )
      super.stop()
  }

  renderSymbol(spinner: Spinner | { status: 'not-started' }): string {
    if (spinner.status === 'not-started') {
      return '-'
    }

    return super.renderSymbol(spinner)
  }

  async logPromiseWait<T>(wait: Promise<T>, labels: labels): Promise<{ interim: any; id: string }> {
    const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
      .toString(36)
      .padStart(6, '0')

    this.log(id, { message: labels.waiting, status: 'not-started' })

    let interim
    try {
      interim = await wait
    } catch (error) {
      const loggerError = error as LoggerError
      // should have been logged by logPromise
      loggerError.logged = true
      throw error
    }

    return { interim, id }
  }
}
