import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Task, TaskConstructor } from '@dotcom-tool-kit/base'
import { Validated, reduceValidated } from '@dotcom-tool-kit/validated'
import type { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'
import { OptionKey, getOptions, setOptions } from '@dotcom-tool-kit/options'
import { loadConfig } from './config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { checkInstall } from './install'
import { styles } from '@dotcom-tool-kit/logger'
import { shouldDisableNativeFetch } from './fetch'
import { runInit } from './init'

type ErrorSummary = {
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

export async function runTasks(logger: Logger, commands: string[], files?: string[]): Promise<void> {
  const config = await loadConfig(logger)

  const availableCommands = Object.keys(config.commandTasks)
    .sort()
    .map((id) => `- ${id}`)
    .join('\n')

  const missingCommands = commands.filter((id) => !config.commandTasks[id])

  if (missingCommands.length > 0) {
    const error = new ToolKitError(`commands ${missingCommands} do not exist`)
    error.details = `maybe you need to install a plugin to define these commands, or configure them in your Tool Kit configuration.

commands that are available are:
${availableCommands}`
    throw error
  }

  for (const pluginOptions of Object.values(config.pluginOptions)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  await runInit(logger, config)
  await checkInstall(logger, config)
  await runInit(logger, config)

  if (shouldDisableNativeFetch()) {
    process.execArgv.push('--no-experimental-fetch')
  }

  const taskNames = commands.flatMap((command) => config.commandTasks[command]?.tasks ?? [])
  const tasks = (await loadTasks(logger, taskNames, config)).unwrap('tasks are invalid')

  for (const command of commands) {
    const errors: ErrorSummary[] = []

    if (!config.commandTasks[command]) {
      logger.warn(`no task configured for ${command}: skipping assignment...`)
      continue
    }

    for (const id of config.commandTasks[command].tasks) {
      try {
        logger.info(styles.taskHeader(`running ${styles.task(id)} task`))
        await tasks[id].run(files)
      } catch (error) {
        // TODO use validated for this
        // allow subsequent command tasks to run on error
        errors.push({
          task: id,
          error: error as Error
        })
      }
    }

    if (errors.length > 0) {
      const error = new ToolKitError(`error running tasks for ${styles.hook(command)}`)
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
