// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;
const CIRCLE_SHA1 = process.env.CIRCLE_SHA1;

export default function buildHerokuReviewApp(repoName: string, branchName: string, pipelineId: string): string {

        const heroku = new Heroku({ token: HEROKU_API_TOKEN })
        const url = `https://github.com/Financial-Times/${repoName}/archive/refs/heads/${branchName}.zip`
        
        return heroku
            .post(`/review-apps`, {body: 
                {
                "branch": branchName,
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

}