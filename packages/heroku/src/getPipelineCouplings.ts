import heroku from './herokuClient'
import type { HerokuApiResGetPipeline, HerokuApiResGetPipelineApps } from 'heroku-client'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { writeState } from '@dotcom-tool-kit/state'

export default async function getPipelineCouplings(pipelineName: string): Promise<void> {
  console.log(`retreiving pipeline id for ${pipelineName}`)
  const piplelineDetails: HerokuApiResGetPipeline = await heroku.get(`/pipelines/${pipelineName}`)

  console.log(`getting product app ids for pipeline id: ${piplelineDetails.id}`)
  const couplings: HerokuApiResGetPipelineApps[] = await heroku.get(
    `/pipelines/${piplelineDetails.id}/pipeline-couplings`
  )

  const prodApps = couplings.filter((app) => app.stage === 'production')

  if (!prodApps) {
    throw new ToolKitError('error retreiving production apps')
  }
  const appIds = prodApps.map((app) => app.app.id)
  console.log(`writing production app ids to state: ${appIds}`)

  writeState(`production`, { appIds })
}
