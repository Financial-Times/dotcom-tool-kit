import type { Spinner } from 'komatsu'
import Komatsu from 'komatsu'

// TODO backport this to Komatsu mainline?
export class Logger extends Komatsu {
  stop() {
    if (
      !Array.from(this.spinners.values()).some(
        (spinner: Spinner | { status: 'not-started' }) => spinner.status === 'not-started'
      )
    )
      super.stop()
  }

  renderSymbol(spinner: Spinner | { status: 'not-started' }) {
    if (spinner.status === 'not-started') {
      return '-'
    }

    return super.renderSymbol(spinner)
  }

  async logPromiseWait<T, U>(wait: Promise<T>, run: (interim: T) => Promise<U>, label: string): Promise<U> {
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
      } catch (error: any) {
        // should have been logged by logPromise
        error.logged = true
        throw error
      }

      this.log(id, { message: labels.pending })

      const result = await run(interim)
      this.log(id, { status: 'done', message: labels.done })
      return result
    } catch (error: any) {
      this.log(id, {
        status: 'fail',
        message: labels.fail,
        error: error.logged ? undefined : error
      })

      error.logged = true
      throw error
    }
  }
}
