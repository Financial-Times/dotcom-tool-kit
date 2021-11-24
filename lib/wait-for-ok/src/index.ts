import { FetchError } from 'node-fetch'
import fetch from 'node-fetch'

const TWO_MINUTES = 2 * 60 * 1000

function waitForOk(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkGtg = async () => {
      console.log(`⏳ polling: ${url}`)

      try {
        const response = await fetch(url, { timeout: 2000, follow: 0 })

        if (response.ok) {
          console.log(`✅ ${url} ok!`)
          clearTimeout(timeout)
          clearInterval(checker)
          return resolve()
        }
        console.log(
          `❌ ${url} not ok, it's responding with status of ${response.status}, response.ok: ${response.ok}`
        )
      } catch (err) {
        if (err instanceof FetchError && err.type && err.type === 'request-timeout') {
          console.log(`👋 Hey, ${url} doesn't seem to be responding yet, so there's that.`)
          console.log("You're amazing, by the way. I don't say that often enough. But you really are.")
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
