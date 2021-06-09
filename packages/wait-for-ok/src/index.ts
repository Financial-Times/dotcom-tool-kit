import fetch from 'node-fetch'

const TWO_MINUTES = 2 * 60 * 1000

export default function waitForOk(url: string): void {
  const checkGtg = async () => {
    console.log(`⏳ polling: ${url}`)

    try {
      const response = await fetch(url, { timeout: 2000, follow: 0 })

      if (response.ok) {
        console.log(`✅ ${url} ok!`)
        clearTimeout(timeout)
        clearInterval(checker)
        return Promise.resolve()
      }
      console.log(`❌ ${url} not ok`)
    } catch (error) {
      if (error.type && error.type === 'request-timeout') {
        console.log(`👋 Hey, ${url} doesn't seem to be responding yet, so there's that.`)
        console.log("You're amazing, by the way. I don't say that often enough. But you really are.")
      } else {
        return Promise.reject(new Error(`😿 ${url} Error: ${error}`))
        clearInterval(checker)
      }
    }
  }

  const timeout = setTimeout(function () {
    return Promise.reject(new Error(`😢 ${url} did not respond with an ok response within two minutes.`))
    clearInterval(checker)
  }, TWO_MINUTES)
  const checker = setInterval(checkGtg, 3000)
}
