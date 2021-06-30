import Heroku from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default async function getHerokuReviewApp(pipelineId: string): Promise<string> {
  try {
    const state = readState('ci')

    if (!state) {
      throw new ToolKitError('Could not find CI') //TODO - remidating actions?
    }

    const branch = state.branch
    // TODO: Retrieve Heroku_api_token from vault (into .env or node) - not currently used
    const heroku = new Heroku({ token: HEROKU_API_TOKEN })
    const reviewApps = await heroku.get(`/pipelines/${pipelineId}/review-apps`)
    const reviewApp = reviewApps.find(
      (instance: { app: { id: string }; branch: string; status: string }): boolean => {
        return instance.branch === branch && instance.status === 'created'
      }
    )
    return reviewApp.app.id || null
  } catch (err) {
    throw new ToolKitError(`An error occured with retreiving your Heroku app: ${err}`)
  }
}
