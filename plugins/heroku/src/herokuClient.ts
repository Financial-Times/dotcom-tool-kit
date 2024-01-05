import Heroku, { type HerokuError } from 'heroku-client'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'

const HEROKU_AUTH_TOKEN = process.env.HEROKU_AUTH_TOKEN

export default new Heroku({ token: HEROKU_AUTH_TOKEN })

// the Heroku client doesn't give particularly useful error messages, so we require an additional context
// string when handling errors coming from it
export function extractHerokuError(context: string): (err: unknown) => never {
  return (err) => {
    if ((err as HerokuError).statusCode) {
      const upstream = err as HerokuError
      const error = new ToolKitError('there was an error calling the Heroku API')
      error.details = `received the error ${styles.errorHighlight(upstream.message)} when ${context}`
      if (upstream.body) {
        error.details += `\n\nresponse from Heroku was:\n${styles.errorHighlight(upstream.body.message)}`
        if (upstream.body.url) {
          error.details += `\nfurther information available at ${styles.URL(upstream.body.url)}`
        }
      }
      throw error
    }
    throw err
  }
}
