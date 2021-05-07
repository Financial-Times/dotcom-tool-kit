import pRetry from 'p-retry'
// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

const heroku = new Heroku({ token: HEROKU_API_TOKEN })

enum Status {
    Pending = 'pending',
    Deleted = 'deleted',
	Creating = 'creating',
	Created = 'created',
	Errored = 'errored'
}

export default async function repeatedCheckForSuccessStatus(reviewAppId: string) {
    
    async function checkForSuccessStatus() {
        heroku
            .get(`/review-apps/${reviewAppId}`)
            .then((reviewApp: {status: string}) => {
                if (reviewApp.status === Status.Deleted) throw new pRetry.AbortError(`Review app was deleted`)
                if (reviewApp.status !== Status.Created) throw new Error(`App build for app id: ${reviewAppId} not yet finished`)
            })
        return
    }

    return pRetry(checkForSuccessStatus, {
        onFailedAttempt: error => {
            const { attemptNumber, retriesLeft } = error;
            console.log(`Attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`) // eslint-disable-line no-console
        },
        retries: 60,
        minTimeout: 10 * 1000        
    })

}