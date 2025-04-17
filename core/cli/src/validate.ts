import type { Logger } from 'winston'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'

import { loadConfig } from './config'
import { loadInitEntrypoints } from './init'
import { loadHookInstallations } from './install'
import { formatUninstalledHooks } from './messages'
import { loadTasks } from './tasks'

export default async function validateConfig(logger: Logger) {
  // validate config but don't catch any errors because none of the rest of the
  // validation will work without a valid config
  const config = await loadConfig(logger, { root: process.cwd() })

  const errors: Error[] = []

  const hookInstallations = await loadHookInstallations(logger, config)
  try {
    // force a ToolKitError to be thrown to reuse the same logic to convert a
    // Validated to an Error
    const hooks = hookInstallations.unwrap('failed to load your hooks')

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
      errors.push(error)
    }
  } catch (error) {
    errors.push(error as ToolKitError)
  }

  const initResults = await loadInitEntrypoints(logger, config)
  try {
    initResults.unwrap('failed to load initialisation functions')
  } catch (error) {
    errors.push(error as ToolKitError)
  }

  const allTasksAndOptions = Object.values(config.commandTasks).flatMap((commandTask) => commandTask.tasks)
  const tasks = await loadTasks(logger, allTasksAndOptions, config)
  try {
    tasks.unwrap('failed to load your tasks')
  } catch (error) {
    errors.push(error as ToolKitError)
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, 'validation failed')
  } else {
    logger.info('everything looks good!')
  }
}
