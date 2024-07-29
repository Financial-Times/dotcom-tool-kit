import type { ValidConfig } from '@dotcom-tool-kit/config'
import { Task, TaskConstructor } from '@dotcom-tool-kit/base'
import { Validated, invalid, reduceValidated, valid } from '@dotcom-tool-kit/validated'
import type { Logger } from 'winston'
import { importEntryPoint } from './plugin/entry-point'
import { loadConfig } from './config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { checkInstall } from './install'
import { styles } from '@dotcom-tool-kit/logger'
import { shouldDisableNativeFetch } from './fetch'
import { runInit } from './init'
import { formatInvalidOption } from './messages'
import { type TaskOptions, TaskSchemas } from '@dotcom-tool-kit/schemas'
import { OptionsForTask } from '@dotcom-tool-kit/plugin'
import type { RootOptions } from '@dotcom-tool-kit/plugin/src/root-schema'
import pluralize from 'pluralize'

type ErrorSummary = {
  task: string
  error: Error
}

export async function loadTasks(
  logger: Logger,
  tasks: OptionsForTask[],
  config: ValidConfig
): Promise<Validated<Task[]>> {
  const taskResults = await Promise.all(
    tasks.map(async ({ task: taskId, options, plugin }) => {
      const entryPoint = config.tasks[taskId]
      const taskResult = await importEntryPoint(Task, entryPoint)

      return taskResult.flatMap<Task>((taskModule) => {
        const configOptions = config.taskOptions[taskId]?.options ?? {}
        const mergedOptions = { ...configOptions, ...options }
        const parsedOptions = (taskModule.schema ?? TaskSchemas[taskId as keyof TaskOptions])?.safeParse(
          mergedOptions
        ) ?? {
          success: true,
          data: mergedOptions
        }

        if (parsedOptions.success) {
          const task = new (taskModule.baseClass as unknown as TaskConstructor)(
            logger,
            taskId,
            config.pluginOptions[entryPoint.plugin.id]?.options ?? {},
            parsedOptions.data,
            plugin
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

export function handleTaskErrors(errors: ErrorSummary[], command: string) {
  throw new AggregateError(
    errors.map(({ task, error }) => {
      error.name = `${styles.task(task)} → ${error.name}`
      return error
    }),
    `${pluralize('error', errors.length, true)} running tasks for ${styles.command(command)}`
  )
}

export async function runTasks(
  logger: Logger,
  config: ValidConfig,
  tasks: Task[],
  command: string,
  files?: string[]
) {
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
    handleTaskErrors(errors, command)
  }
}

export async function runCommandsFromConfig(
  logger: Logger,
  config: ValidConfig,
  commands: string[],
  files?: string[]
): Promise<void> {
  await runInit(logger, config)
  await checkInstall(logger, config)

  if (
    shouldDisableNativeFetch(config.pluginOptions['app root'].options as RootOptions) &&
    !process.execArgv.includes('--no-experimental-fetch')
  ) {
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

  // at this point we no longer need to update the config, so freeze it before
  // passing it into task run contexts so that plugins can't do crimes
  Object.freeze(config)

  for (const { command, tasks } of commandTasks) {
    await runTasks(logger, config, tasks, command, files)
  }
}

export async function runCommands(logger: Logger, commands: string[], files?: string[]): Promise<void> {
  const config = await loadConfig(logger, { root: process.cwd() })

  return runCommandsFromConfig(logger, config, commands, files)
}
