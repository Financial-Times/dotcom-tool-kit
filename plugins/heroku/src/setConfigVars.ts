import type { Logger } from 'winston'
import { DopplerEnvVars, Environment } from '@dotcom-tool-kit/doppler'
import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResGetRegion, HerokuApiResPipeline } from 'heroku-client'

type Stage = 'test' | 'development' | 'review' | 'staging' | 'production'

async function setAppConfigVars(
  logger: Logger,
  appIdName: string,
  environment: Environment,
  systemCode?: string
): Promise<void> {
  logger.info(`setting config vars for ${appIdName}`)

  const dopplerEnvVars = new DopplerEnvVars(logger, environment)
  const { secrets: configVars, source } = await dopplerEnvVars.getWithSource()
  // HACK:20230925:IM we only want to set secrets from Vault, if we're using
  // Doppler we should let its own Heroku integration handle secrets syncing
  if (source === 'doppler') {
    return
  }

  const { region } = await heroku
    .get<HerokuApiResGetRegion>(`/apps/${appIdName}`)
    .catch(extractHerokuError(`getting region for app ${appIdName}`))
  configVars.REGION = region.name.toUpperCase()

  if (systemCode) {
    configVars.SYSTEM_CODE = systemCode
  }
  await heroku
    .patch(`/apps/${appIdName}/config-vars`, {
      body: configVars
    })
    .catch(extractHerokuError(`getting configuration variables for app ${appIdName}`))

  logger.verbose('the following values have been set:', Object.keys(configVars).join(', '))

  logger.info(`${appIdName} config vars have been updated successfully.`)
}

async function setStageConfigVars(
  logger: Logger,
  stage: Stage,
  environment: Environment,
  pipelineName: string,
  systemCode?: string
): Promise<void> {
  logger.info(`setting config vars for ${stage} stage`)

  const dopplerEnvVars = new DopplerEnvVars(logger, environment)

  const { secrets: configVars, source } = await dopplerEnvVars.getWithSource()
  // HACK:20230925:IM we only want to set secrets from Vault, if we're using
  // Doppler we should let its own Heroku integration handle secrets syncing
  if (source === 'doppler') {
    return
  }

  if (systemCode) {
    configVars.SYSTEM_CODE = systemCode
  }
  // Some of our code expects review apps to have their NODE_ENV set to
  // 'branch' so that they can change behaviour for them (e.g., mocking out
  // writes to production DB's.)
  if (stage === 'review') {
    configVars.NODE_ENV = 'branch'
  }
  const pipeline = await heroku
    .get<HerokuApiResPipeline>(`/pipelines/${pipelineName}`)
    .catch(extractHerokuError(`getting pipeline ${pipelineName}`))
  await heroku
    .patch(`/pipelines/${pipeline.id}/stage/${stage}/config-vars`, {
      body: configVars
    })
    .catch(
      extractHerokuError(`setting configuration variables for ${stage} stage in pipeline ${pipelineName}`)
    )

  logger.verbose('the following values have been set:', Object.keys(configVars).join(', '))

  logger.info(`config vars for ${stage} stage have been updated successfully.`)
}

export { setAppConfigVars, setStageConfigVars }
