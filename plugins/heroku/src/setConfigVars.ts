import type { Logger } from 'winston'
import { DopplerEnvVars, Environment } from '@dotcom-tool-kit/doppler'
import { getOptions } from '@dotcom-tool-kit/options'
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

  // HACK:20221024:IM We need to call Vault to check whether a project has
  // migrated to Doppler yet, and sync Vault secrets if it hasn't, but this
  // function should be removed entirely once we drop support for Vault. The
  // secret is only stored in Vault's continuous-integration folder so check
  // that and then get the passed argument later if the secret isn't present.
  // We can skip this call if we find the project has already added options for
  // doppler in the Tool Kit configuration.
  const migratedToolKitToDoppler = Boolean(getOptions('@dotcom-tool-kit/doppler'))
  if (migratedToolKitToDoppler) {
    return
  }
  const dopplerEnvVars = new DopplerEnvVars(logger, 'ci')
  let configVars = await dopplerEnvVars.fallbackToVault()
  // HACK:20221023:IM don't overwrite secrets when the project has already
  // migrated from Vault to Doppler – Doppler will handle the secret syncing
  // for us
  if (configVars.MIGRATED_TO_DOPPLER) {
    return
  }
  if (environment !== 'ci') {
    const dopplerEnvVars = new DopplerEnvVars(logger, environment)
    configVars = await dopplerEnvVars.fallbackToVault()
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

  // HACK:20221024:IM We need to call Vault to check whether a project has
  // migrated to Doppler yet, and sync Vault secrets if it hasn't, but this
  // function should be removed entirely once we drop support for Vault. The
  // secret is only stored in Vault's continuous-integration folder so check
  // that and then get the passed argument later if the secret isn't present.
  // We can skip this call if we find the project has already added options for
  // doppler in the Tool Kit configuration.
  const migratedToolKitToDoppler = Boolean(getOptions('@dotcom-tool-kit/doppler'))
  if (migratedToolKitToDoppler) {
    return
  }
  const dopplerEnvVars = new DopplerEnvVars(logger, 'ci')
  let configVars = await dopplerEnvVars.fallbackToVault()
  // HACK:20221023:IM don't overwrite secrets when the project has already
  // migrated from Vault to Doppler – Doppler will handle the secret syncing
  // for us
  if (configVars.MIGRATED_TO_DOPPLER) {
    return
  }
  if (environment !== 'ci') {
    const dopplerEnvVars = new DopplerEnvVars(logger, environment)
    configVars = await dopplerEnvVars.fallbackToVault()
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
