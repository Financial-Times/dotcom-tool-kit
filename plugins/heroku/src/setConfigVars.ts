import type { Logger } from 'winston'
import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { VaultEnvVars, Environment } from '@dotcom-tool-kit/vault'

type Stage = 'test' | 'development' | 'review' | 'staging' | 'production'

async function setAppConfigVars(
  logger: Logger,
  appIdName: string,
  environment: Environment,
  systemCode?: string,
): Promise<void> {
  try {
    logger.info(`setting config vars for ${appIdName}`)

    const vaultEnvVars = new VaultEnvVars(logger, {
      environment
    })

    const configVars = await vaultEnvVars.get()

    if (systemCode) {
      configVars.SYSTEM_CODE = systemCode
    }

    await heroku.patch(`/apps/${appIdName}/config-vars`, { body: configVars })

    logger.verbose('the following values have been set:', Object.keys(configVars).join(', '))
    
    logger.info(`${appIdName} config vars have been updated successfully.`)

  } catch (err) {
    const error = new ToolKitError(`Error updating config vars for ${appIdName} app`)
    if (err instanceof Error) {
      error.details = err.message
    }
    throw error
  }
}

async function setStageConfigVars(
  logger: Logger,
  stage: Stage,
  environment: Environment,
  pipelineId: string,
): Promise<void> {
  try {
    logger.info(`setting config vars for ${stage} stage`)
    console.log('new vault client instance') //eslint-disable-line
    const vaultEnvVars = new VaultEnvVars(logger, {
      environment
    })
    console.log('getting secrets') //eslint-disable-line
    const configVars = await vaultEnvVars.get()

    console.log('got secrets', typeof Object.keys(configVars).join(', ')) //eslint-disable-line
    Object.values(configVars).forEach(value => console.log('value', value.slice(0,2))) //eslint-disable-line

    await heroku.patch(`/pipelines/${pipelineId}/stage/${stage}/config-vars`, { body: configVars })

    console.log('this should not print ') //eslint-disable-line

    logger.verbose('the following values have been set:', Object.keys(configVars).join(', '))
    
    logger.info(`config vars for ${stage} stage have been updated successfully.`)

  } catch (err) {
    const error = new ToolKitError(`Error updating config vars for ${stage} stage, pipelineID: ${pipelineId}`)
    if (err instanceof Error) {
      error.details = err.message
    }
    throw error
  }
}

export { setAppConfigVars, setStageConfigVars }