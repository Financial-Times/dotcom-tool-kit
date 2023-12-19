import { ToolKitError } from '@dotcom-tool-kit/error'
import { loadConfig } from './config'
import { OptionKey, getOptions, setOptions } from '@dotcom-tool-kit/options'
import { styles } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'
import util from 'util'
import { formatPluginTree } from './messages'
import { Task, TaskConstructor, ValidConfig, Validated, reduceValidated } from '@dotcom-tool-kit/types'
import { importEntryPoint } from './plugin'
import { checkInstall } from './install'

type ErrorSummary = {
  hook: string
  task: string
  error: Error
}

// function that plugins can check if they need to implement their own logic to
// disable Node 18's native fetch
export const shouldDisableNativeFetch = (): boolean => {
  // disable Node 18's native fetch if the Node runtime supports it (older
  // runtimes don't support the flag, implying they also don't use native
  // fetch) and the user hasn't opted out of the behaviour
  return (
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * the root plugin has default options and it always exists so is always
     * defined
     **/
    !getOptions('app root')!.allowNativeFetch &&
    process.allowedNodeEnvironmentFlags.has('--no-experimental-fetch')
  )
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
        // if there's an exit code, that's a request from the task to exit early
        if(error instanceof ToolKitError && error.exitCode) {
          throw error
        }

        // if not, we allow subsequent hook tasks to run on error
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

export async function listPlugins(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false })

  const rootPlugin = config.plugins['app root']
  if (rootPlugin?.valid) {
    logger.info(formatPluginTree(rootPlugin.value).join('\n'))
  }
}

export async function printConfig(logger: Logger): Promise<void> {
  const config = await loadConfig(logger, { validate: false })

  logger.info(util.inspect(config, { depth: null, colors: true }))
}
