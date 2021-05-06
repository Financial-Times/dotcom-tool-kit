// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;
const CIRCLE_SHA1 = process.env.CIRCLE_SHA1;
const CIRCLE_PROJECT_REPONAME = process.env.CIRCLE_PROJECT_REPONAME;
const CIRCLE_BRANCH = process.env.CIRCLE_BRANCH;

export default function buildHerokuReviewApp(pipelineId: string): string {

        const heroku = new Heroku({ token: HEROKU_API_TOKEN })
        const url = `https://github.com/Financial-Times/${CIRCLE_PROJECT_REPONAME}/archive/refs/heads/${CIRCLE_BRANCH}.zip`
        
        return heroku
            .post(`/review-apps`, {body: 
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

            //need check for build completion

}

/*
build: dotcom-tool-kit lifecycle deploy:review
test-smoke: dotcom-tool-kit lifecycle test:review
*/