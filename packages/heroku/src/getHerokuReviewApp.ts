import heroku from './herokuClient'
import type { HerokuApiResGetReview } from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessStatus'

export default async function getHerokuReviewApp(pipelineId: string): Promise<string | undefined> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('Could not find CI') //TODO - remidating actions?
  }

  const branch = state.branch
  const reviewApps: HerokuApiResGetReview[] = await heroku.get(`/pipelines/${pipelineId}/review-apps`)
  let creatingAppId

  const reviewApp = reviewApps.find(
    (instance: { app: { id: string }; branch: string; status: string }): boolean => {
      if (instance.branch === branch && instance.status === 'creating') {
        creatingAppId = instance.app.id
      }
      return instance.branch === branch && instance.status === 'created'
    }
  )
  if (creatingAppId) {
    await repeatedCheckForSuccessStatus(creatingAppId)
  }

  return reviewApp?.app?.id
}
