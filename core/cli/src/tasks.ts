import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Task, TaskConstructor } from '@dotcom-tool-kit/base'
import { Validated, invalid, reduceValidated, valid } from '@dotcom-tool-kit/validated'
import type { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'
import { OptionKey, getOptions, setOptions } from '@dotcom-tool-kit/options'
import { loadConfig } from './config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { checkInstall } from './install'
import { styles } from '@dotcom-tool-kit/logger'
import { shouldDisableNativeFetch } from './fetch'
import { runInit } from './init'
import { formatInvalidOption } from './messages'
import { type TaskOptions, TaskSchemas } from '@dotcom-tool-kit/schemas'
import { OptionsForTask } from '@dotcom-tool-kit/plugin'
import pluralize from 'pluralize'

type ErrorSummary = {
  task: string
  error: Error
}

const loadTasks = async (
  logger: Logger,
  tasks: OptionsForTask[],
  config: ValidConfig
): Promise<Validated<Task[]>> => {
  const taskResults = await Promise.all(
    tasks.map(async ({ task: taskId, options }) => {
      const entryPoint = config.tasks[taskId]
      const taskResult = await importEntryPoint(Task, entryPoint)

      return taskResult.flatMap<Task>((Task) => {
        const taskSchema = TaskSchemas[taskId as keyof TaskOptions]
        const configOptions = config.taskOptions[taskId]?.options ?? {}
        const mergedOptions = { ...configOptions, ...options }
        const parsedOptions = taskSchema?.safeParse(mergedOptions) ?? {
          success: true,
          data: mergedOptions
        }

        if (parsedOptions.success) {
          const task = new (Task as unknown as TaskConstructor)(
            logger,
            taskId,
            getOptions(entryPoint.plugin.id as OptionKey) ?? {},
            parsedOptions.data
          )
          return valid(task)
        } else {
          return invalid([formatInvalidOption([styles.task(taskId), parsedOptions.error])])
        }
      })
    })
  )

  return reduceValidated(taskResults)
}

export async function runTasksFromConfig(
  logger: Logger,
  config: ValidConfig,
  commands: string[],
  files?: string[]
): Promise<void> {
  for (const pluginOptions of Object.values(config.pluginOptions)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  await runInit(logger, config)
  await checkInstall(logger, config)

  if (shouldDisableNativeFetch(config.pluginOptions['app root'].options)) {
    process.execArgv.push('--no-experimental-fetch')
  }

  const commandTasks = reduceValidated(
    await Promise.all(
      commands.map(async (command) => {
        const tasks = config.commandTasks[command]?.tasks ?? []
        const validatedTaskInstances = await loadTasks(logger, tasks, config)

        return validatedTaskInstances.map((taskInstances) => ({ command, tasks: taskInstances }))
      })
    )
  ).unwrap('tasks are invalid!')

  for (const { command, tasks } of commandTasks) {
    const errors: ErrorSummary[] = []

    if (tasks.length === 0) {
      logger.warn(`no task configured for ${command}: skipping assignment...`)
    }

    for (const task of tasks) {
      try {
        logger.info(styles.taskHeader(`running ${styles.task(task.id)} task`))
        await task.run({ files, command, cwd: config.root, config })
      } catch (error) {
        // if there's an exit code, that's a request from the task to exit early
        if (error instanceof ToolKitError && error.exitCode) {
          throw error
        }

        // if not, we allow subsequent hook tasks to run on error
        // TODO use validated for this
        errors.push({
          task: task.id,
          error: error as Error
        })
      }
    }

    if (errors.length > 0) {
      throw new AggregateError(
        errors.map(({ task, error }) => {
          error.name = `${styles.task(task)} → ${error.name}`
          return error
        }),
        `${pluralize('error', errors.length, true)} running tasks for ${styles.command(command)}`
      )
    }
  }
}

export async function runTasks(logger: Logger, commands: string[], files?: string[]): Promise<void> {
  const config = await loadConfig(logger, { root: process.cwd() })

  return runTasksFromConfig(logger, config, commands, files)
}
