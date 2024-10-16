import type { Logger } from 'winston'

const TWO_MINUTES = 2 * 60 * 1000

function waitForOk(logger: Logger, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkGtg = async () => {
      logger.info(`⏳ polling: ${url}`)

      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(2000), redirect: 'error' })

        if (response.ok) {
          logger.info(`✅ ${url} ok!`)
          clearTimeout(timeout)
          clearInterval(checker)
          return resolve()
        }
        logger.error(
          `❌ ${url} not ok, it's responding with status of ${response.status}, response.ok: ${response.ok}`
        )
      } catch (err) {
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          logger.warn(`👋 Hey, ${url} doesn't seem to be responding yet, so there's that.`)
          logger.warn("You're amazing, by the way. I don't say that often enough. But you really are.")
        } else {
          clearInterval(checker)
          return reject(new Error(`😿 ${url} Error: ${err}`))
        }
      }
    }

    const timeout = setTimeout(function () {
      clearInterval(checker)
      return reject(new Error(`😢 ${url} did not respond with an ok response within two minutes.`))
    }, TWO_MINUTES)
    const checker = setInterval(checkGtg, 3000)
  })
}

export { waitForOk }
