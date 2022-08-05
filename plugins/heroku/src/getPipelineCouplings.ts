import heroku from './herokuClient'
import type { HerokuApiResGetPipeline, HerokuApiResGetPipelineApps } from 'heroku-client'
import type { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { State, writeState } from '@dotcom-tool-kit/state'

async function getPipelineCouplings(logger: Logger, pipelineName: string): Promise<void> {
  logger.verbose(`retrieving pipeline id for ${pipelineName}`)
  const piplelineDetails: HerokuApiResGetPipeline = await heroku.get(`/pipelines/${pipelineName}`)

  logger.verbose(`getting product app ids for pipeline id: ${piplelineDetails.id}`)
  const couplings: HerokuApiResGetPipelineApps[] = await heroku.get(
    `/pipelines/${piplelineDetails.id}/pipeline-couplings`
  )

  const stages = ['production', 'staging'] as const

  stages.forEach((stage) => {
    const apps = couplings.filter((app) => app.stage === stage)
    if (!apps) {
      const error = new ToolKitError(`could not find any ${stage} apps`)
      error.details = `check in the Heroku console that your pipeline is configured correctly for ${stage}.`
      throw error
    }
    const appIds = apps.map((app) => app.app.id)
    logger.verbose(`writing ${stage} app ids to state: ${appIds}`)

    writeState(stage, { appIds })
  })

  return
}

export { getPipelineCouplings }
