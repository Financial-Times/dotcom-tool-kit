import fetch from 'node-fetch'

const TWO_MINUTES = 2 * 60 * 1000

export default function waitForOk(url: string) {
  let timeout: NodeJS.Timeout // eslint-disable-line no-undef
  let checker: NodeJS.Timeout // eslint-disable-line no-undef

  async function checkGtg() {
    console.log(`⏳ polling: ${url}`) // eslint-disable-line no-console

    try {
     // @ts-ignore
      const response = await fetch(url, { timeout: 2000, follow: 0 })

      if (response.ok) {
        console.log(`✅ ${url} ok!`) // eslint-disable-line no-console
        clearTimeout(timeout)
        clearInterval(checker)
        return Promise.resolve()
      }
      console.log(`❌ ${url} not ok`) // eslint-disable-line no-console
    } catch (error) {
      if (error.type && error.type === 'request-timeout') {
        console.log(`👋 Hey, ${url} doesn't seem to be responding yet, so there's that.`) // eslint-disable-line no-console
        console.log("You're amazing, by the way. I don't say that often enough. But you really are.") // eslint-disable-line no-console
      } else {
        return Promise.reject(new Error(`😿 ${url} Error: ${error}`))
        clearInterval(checker)
      }
    }
  }

  checker = setInterval(checkGtg, 3000)

  timeout = setTimeout(function () {
    return Promise.reject(new Error(`😢 ${url} did not respond with an ok response within two minutes.`))
    clearInterval(checker)
  }, TWO_MINUTES)
}
