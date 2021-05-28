import pRetry from 'p-retry'
// @ts-ignore
import Heroku from 'heroku-client'

const NUM_RETRIES = process.env.HEROKU_REVIEW_APP_NUM_RETRIES ? parseInt(process.env.HEROKU_REVIEW_APP_NUM_RETRIES) : 60
const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export default async function repeatedCheckForSuccessStatus(reviewAppId: string) {

    const heroku = new Heroku({ token: HEROKU_API_TOKEN })
    
    async function checkForSuccessStatus() {
        const reviewApp = await heroku.get(`/review-apps/${reviewAppId}`)
        if (reviewApp.status === 'deleted') throw new pRetry.AbortError(`Review app was deleted`)
        if (reviewApp.status !== 'created') throw new Error(`App build for app id: ${reviewAppId} not yet finished`)

        return true
    }

    const result = await pRetry(checkForSuccessStatus, {
        onFailedAttempt: error => {
            const { attemptNumber, retriesLeft } = error;
            console.log(`Attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`) // eslint-disable-line no-console
        },
        retries: NUM_RETRIES,
        minTimeout: 10 * 1000        
    })

    return result
}