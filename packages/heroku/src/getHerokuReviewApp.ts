// @ts-ignore
import Heroku from 'heroku-client'
import getCIVars from './getCIVars'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export default async function getHerokuReviewApp(pipelineId: string): Promise<string> {
	
	const { branch } = await getCIVars(['branch'])
    // TODO: Retrieve Heroku_api_token from vault (into .env or node) - not currently used
    const heroku = new Heroku({ token: HEROKU_API_TOKEN })

    return heroku
        .get(`/pipelines/${pipelineId}/review-apps`)
        .then((reviewApps: []): string | null => {
            console.log(`Searching for a review app for ${branch} on pipeline ${pipelineId}`); // eslint-disable-line no-console

			const reviewApp: {app: {id: string}, branch: string, status: string} = reviewApps.find((instance: {app: {id: string}, branch: string, status: string}): boolean => {
				return instance.branch === branch && instance.status === "created";
			})!
			return reviewApp.app.id || null
        })
		.catch((err: string) => {
			console.error('Error retrieving review app from Heroku'); // eslint-disable-line no-console
			console.error(err); // eslint-disable-line no-console
			return null //TODO: should this be null?
		});
}