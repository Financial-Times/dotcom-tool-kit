import { HerokuApiResGetSlug } from 'heroku-client'
import heroku from './herokuClient'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function getSlug(): Promise<string> {
  const state = readState('staging')

  if (!state) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  const appName = state.appName
  const releases: HerokuApiResGetSlug = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }
  return latest.slug.id
}

// {
//   "addon_plan_names": [
//       "heroku-postgresql:hobby-dev"
//   ],
//   "app": {
//       "id": "24be55a4-fbe6-495f-a7a7-d522e78304a6",
//       "name": "boiling-mountain-96586"
//   },
//   "created_at": "2021-02-22T21:41:26Z",
//   "description": "Deploy 3d687367",
//   "status": "succeeded",
//   "id": "6b99e017-1fc2-495f-9077-96f0c8f17146",
//   "slug": {
//       "id": "570ffdbb-64d2-4b1d-8a9a-8fc60af7bf15"
//   },
//   "updated_at": "2021-02-22T21:41:26Z",
//   "user": {
//       "email": "leanne.cornish@gmail.com",
//       "id": "ccbea410-2b70-40c9-b8d2-3ca678c7850a"
//   },
//   "version": 9,
//   "current": true,
//   "output_stream_url": null
// }
