import type { Spinner } from 'komatsu'
import Komatsu from 'komatsu'

type LoggerError = Error & {
  logged?: boolean
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

  async logPromiseWait<T, U>(
    wait: Promise<T>,
    run: (interim: T) => Promise<U>,
    label: string,
    quiet = false
  ): Promise<U> {
    const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
      .toString(36)
      .padStart(6, '0')

    const labels = {
      waiting: `not ${label} yet`,
      pending: label,
      done: `finished ${label}`,
      fail: `error with ${label}`
    }

    this.log(id, { message: labels.waiting, status: 'not-started' })

    try {
      let interim
      try {
        interim = await wait
      } catch (error) {
        const loggerError = error as LoggerError
        // should have been logged by logPromise
        loggerError.logged = true
        throw error
      }

      this.log(id, { message: labels.pending })

      const result = await run(interim)
      this.log(id, { status: 'done', message: labels.done })
      return result
    } catch (error) {
      const loggerError = error as LoggerError
      this.log(id, {
        status: 'fail',
        message: labels.fail,
        error: loggerError.logged || quiet ? undefined : loggerError
      })

      loggerError.logged = true
      throw error
    }
  }
}
