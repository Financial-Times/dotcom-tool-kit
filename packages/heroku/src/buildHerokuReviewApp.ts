// @ts-ignore
import Heroku from 'heroku-client'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessSatus'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;
const CIRCLE_SHA1 = process.env.CIRCLE_SHA1;
const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME;
const CIRCLE_BRANCH = process.env.CIRCLE_BRANCH;
const heroku = new Heroku({ token: HEROKU_API_TOKEN })

export default async function buildHerokuReviewApp(pipelineId: string): Promise<string> {

        const url = `https://github.com/Financial-Times/${CIRCLE_PROJECT_REPONAME}/archive/refs/heads/${CIRCLE_BRANCH}.zip`
        
        const reviewAppId = 
            heroku.post(`/review-apps`, {body: 
                {
                "branch": CIRCLE_BRANCH,
                "pipeline": pipelineId,
                "source_blob" : {
                    "url": url,
                    "version": CIRCLE_SHA1
                    }
                }
            })
            .then((reviewApp: {id: string}): string => {
                return reviewApp.id
            })
        
        const successStatus = await repeatedCheckForSuccessStatus(reviewAppId)

        if (successStatus) {
            return reviewAppId
        } else {
            console.error(`Something went wrong with building the review-app`) // eslint-disable-line no-console
            process.exit(1)
        }
}

/*
build: dotcom-tool-kit lifecycle deploy:review
test-smoke: dotcom-tool-kit lifecycle test:review
*/