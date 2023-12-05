import { Task, TaskConstructor, ValidConfig, Validated, reduceValidated } from '@dotcom-tool-kit/types'
import type { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'
import { OptionKey, getOptions, setOptions } from '@dotcom-tool-kit/options'
import { loadConfig } from './config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { checkInstall } from './install'
import { styles } from '@dotcom-tool-kit/logger'
import { shouldDisableNativeFetch } from './fetch'

type ErrorSummary = {
  hook: string
  task: string
  error: Error
}

const loadTasks = async (
  logger: Logger,
  taskNames: string[],
  config: ValidConfig
): Promise<Validated<Record<string, Task>>> => {
  const taskResults = await Promise.all(
    taskNames.map(async (taskName) => {
      const entryPoint = config.tasks[taskName]
      const taskResult = await importEntryPoint(Task, entryPoint)

      return taskResult.map((Task) => [
        taskName,
        new ((Task as unknown) as TaskConstructor)(
          logger,
          taskName,
          getOptions(entryPoint.plugin.id as OptionKey) ?? {}
        )
      ])
    })
  )

  return reduceValidated(taskResults).map(Object.fromEntries)
}

export async function runTasks(logger: Logger, hooks: string[], files?: string[]): Promise<void> {
  const config = await loadConfig(logger)

  const availableHooks = Object.keys(config.hooks)
    .sort()
    .map((id) => `- ${id}`)
    .join('\n')

  const missingHooks = hooks.filter((id) => !config.hooks[id])

  if (missingHooks.length > 0) {
    const error = new ToolKitError(`hooks ${missingHooks} do not exist`)
    error.details = `maybe you need to install a plugin to handle these hooks, or configure them in your Tool Kit configuration.

hooks that are available are:
${availableHooks}`
    throw error
  }

  for (const pluginOptions of Object.values(config.options)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  await checkInstall(logger, config)

  if (shouldDisableNativeFetch()) {
    process.execArgv.push('--no-experimental-fetch')
  }

  const taskNames = hooks.flatMap((hook) => config.commandTasks[hook]?.tasks ?? [])
  const tasks = (await loadTasks(logger, taskNames, config)).unwrap('tasks are invalid')

  for (const hook of hooks) {
    const errors: ErrorSummary[] = []

    if (!config.commandTasks[hook]) {
      logger.warn(`no task configured for ${hook}: skipping assignment...`)
      continue
    }

    for (const id of config.commandTasks[hook].tasks) {
      try {
        logger.info(styles.taskHeader(`running ${styles.task(id)} task`))
        await tasks[id].run(files)
      } catch (error) {
        // allow subsequent hook tasks to run on error
        errors.push({
          hook,
          task: id,
          error: error as Error
        })
      }
    }

    if (errors.length > 0) {
      const error = new ToolKitError(`error running tasks for ${styles.hook(hook)}`)
      error.details = errors
        .map(
          ({ task, error }) =>
            `${styles.heading(`${styles.task(task)}:`)}

${error.message}${
              error instanceof ToolKitError
                ? `

${error.details}`
                : ''
            }`
        )
        .join(`${styles.dim(styles.ruler())}\n`)

      error.exitCode = errors.length + 1
      throw error
    }
  }
}