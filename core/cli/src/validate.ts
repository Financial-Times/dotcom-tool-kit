import type { Logger } from 'winston'

import type { Init } from '@dotcom-tool-kit/base'
import type { ValidConfig } from '@dotcom-tool-kit/config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { Validated, invalid, reduceValidated, valid } from '@dotcom-tool-kit/validated'

import { loadConfig } from './config'
import { loadInitEntrypoints } from './init'
import { loadHookInstallations } from './install'
import { formatUninstalledHooks } from './messages'
import { loadTasks } from './tasks'

async function validateConfig(logger: Logger, config: ValidConfig): Promise<Validated<Init[], Error>> {
  const errors: Error[] = []

  const hookInstallations = await loadHookInstallations(logger, config)
  const hookInstallationsResult = await hookInstallations
    .context('failed to load your hooks')
    .flatMapAsync(async (hooks) => {
      const uninstalledHooks = []
      for (const hook of hooks) {
        if (!(await hook.isInstalled())) {
          uninstalledHooks.push(hook)
        }
      }
      if (uninstalledHooks.length > 0) {
        const error = new ToolKitError(
          `some hooks have not been installed. run ${styles.code(
            'npx dotcom-tool-kit --install'
          )} to update your config.`
        )
        error.details = formatUninstalledHooks(uninstalledHooks)
        return invalid([error])
      }
      return valid(undefined)
    })
  if (!hookInstallationsResult.valid) {
    errors.push(...hookInstallationsResult.reasons)
  }

  const initResults = (await loadInitEntrypoints(logger, config)).context(
    'failed to load initialisation functions'
  )
  if (!initResults.valid) {
    errors.push(...initResults.reasons)
  }

  const allTasksAndOptions = Object.values(config.commandTasks).flatMap((commandTask) => commandTask.tasks)
  const tasks = (await loadTasks(logger, allTasksAndOptions, config)).context('failed to load your tasks')
  if (!tasks.valid) {
    errors.push(...tasks.reasons)
  }

  return errors.length > 0 ? invalid(errors) : initResults
}

async function validateMonorepo(
  logger: Logger,
  initEntrypoints: Init[]
): Promise<Validated<undefined, Error>> {
  const monorepoInit = initEntrypoints.find(
    (entrypoint) => entrypoint.constructor.name === 'LoadWorkspaceConfigs'
  )
  if (!monorepoInit) {
    return valid(undefined)
  }
  try {
    await monorepoInit.init({ cwd: process.cwd() })
  } catch (error) {
    return invalid<undefined, AggregateError>([error as AggregateError]).context(
      'failed to load monorepo configs'
    )
  }

  // HACK:IM:20250509 structurally equivalent to the static
  // LoadWorkspaceConfigs type from the monorepo plugin but avoids creating a
  // circular reference with it
  const { configs } = monorepoInit.constructor as unknown as {
    configs: { packageId: string; config: ValidConfig }[]
  }
  const validatedConfigs = await Promise.all(
    configs.map(async ({ packageId, config }) => {
      const result = await validateConfig(logger, config)
      return result.context(`failed to load ${styles.plugin(packageId)} monorepo package`)
    })
  )
  return reduceValidated(validatedConfigs).map(() => undefined)
}

export default async function validate(logger: Logger) {
  // load config but don't catch any errors because none of the rest of the
  // validation will work without a valid config
  const config = await loadConfig(logger, { root: process.cwd() })
  const configValidated = await validateConfig(logger, config)

  const monorepoValidated = await configValidated.flatMapAsync(async (initEntrypoints) =>
    initEntrypoints ? validateMonorepo(logger, initEntrypoints) : valid(undefined)
  )

  monorepoValidated.unwrap('validation failed')
  logger.info('everything looks good!')
}
