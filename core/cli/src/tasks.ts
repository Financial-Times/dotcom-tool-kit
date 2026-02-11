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
import { guessSystemCode } from './systemCode'
import { enableTelemetry } from './telemetry'
import { type TaskOptions, TaskSchemas } from '@dotcom-tool-kit/schemas'
import { OptionsForTask } from '@dotcom-tool-kit/plugin'
import type { RootOptions } from '@dotcom-tool-kit/plugin/src/root-schema'
import pluralize from 'pluralize'
import type { ReadonlyDeep } from 'type-fest'
import { type TelemetryRecorder, MockTelemetryClient } from '@dotcom-tool-kit/telemetry'

export type ErrorSummary = {
  task: string
  error: Error
}

export async function loadTasks(
  logger: Logger,
  tasks: OptionsForTask[],
  config: ReadonlyDeep<ValidConfig>,
  // TODO:IM:20251215 make this a required parameter in the next major version.
  // this function is currently used by the parallel plugin and so
  // can't be changed yet.
  metrics?: TelemetryRecorder
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
          const scoped = metrics?.scoped({ plugin: entryPoint.plugin.id })
          const task = new (taskModule.baseClass as unknown as TaskConstructor)(
            logger,
            taskId,
            config.pluginOptions[entryPoint.plugin.id]?.options ?? {},
            parsedOptions.data,
            plugin,
            scoped
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
  metrics: TelemetryRecorder,
  config: ValidConfig,
  tasks: Task[],
  command: string,
  files?: string[]
) {
  const errors: ErrorSummary[] = []

  // TODO:CC:20260205: Remove the default dotcom-tool-kit once the systemCode is a required option
  // (see TODO in root schema) but at the moment we can't have it undefined
  // because it is required by the client-metrics-server
  const systemCode = (await guessSystemCode(config)) || 'dotcom-tool-kit'

  if (tasks.length === 0) {
    logger.warn(`no task configured for ${command}: skipping assignment...`)
  }

  for (const task of tasks) {
    const scoped = metrics.scoped({ task: task.id })
    try {
      logger.info(styles.taskHeader(`running ${styles.task(task.id)} task`))
      await task.run({ files, command, cwd: config.root, config })
      scoped.recordEvent('tasks.completed', systemCode, { success: true })
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
      scoped.recordEvent('tasks.completed', systemCode, { success: false })
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
  files?: string[],
  // TODO:IM:20251215 make this a required parameter in the next major version.
  // this function is currently used by the monorepo plugin and so can't be
  // changed yet.
  metrics: TelemetryRecorder = new MockTelemetryClient()
): Promise<void> {
  await runInit(logger, config)
  await checkInstall(logger, metrics, config)

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
        const scoped = metrics.scoped({ command })
        const validatedTaskInstances = await loadTasks(logger, tasks, config, scoped)

        return validatedTaskInstances.map((taskInstances) => ({ command, tasks: taskInstances }))
      })
    )
  ).unwrap('tasks are invalid!')

  // at this point we no longer need to update the config, so freeze it before
  // passing it into task run contexts so that plugins can't do crimes
  Object.freeze(config)

  for (const { command, tasks } of commandTasks) {
    const scoped = metrics.scoped({ command })
    await runTasks(logger, scoped, config, tasks, command, files)
  }
}

export async function runCommands(
  logger: Logger,
  metrics: TelemetryRecorder,
  commands: string[],
  files?: string[]
): Promise<void> {
  const config = await loadConfig(logger, { root: process.cwd() })
  enableTelemetry(metrics, config.pluginOptions['app root'].options as RootOptions)

  return runCommandsFromConfig(logger, config, commands, files, metrics)
}
