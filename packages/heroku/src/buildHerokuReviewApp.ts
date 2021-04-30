// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export default function buildHerokuReviewApp(branchName: string, pipelineId: string, url: string, repoVersion: string): string {
        // TODO: Retrieve Heroku_api_token from vault (into .env or node) - not currently used
        const heroku = new Heroku({ token: HEROKU_API_TOKEN })
        
        return heroku
            .post(`/review-apps`, {body: 
                {
                "branch": branchName,
                "pipeline": pipelineId,
                "source_blob" : {
                    "url": url,
                    "version": repoVersion
                    }
                }
            })
            .then((reviewApp: {id: string}): string => {
                return reviewApp.id
            })

}