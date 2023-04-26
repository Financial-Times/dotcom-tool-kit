import { ToolKitError } from '@dotcom-tool-kit/error'
import { loadConfig } from './config'
import { OptionKey, getOptions, setOptions } from '@dotcom-tool-kit/options'
import { styles } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'
import { formatPluginTree } from './messages'
import { TaskClass } from '@dotcom-tool-kit/types'

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

  if (shouldDisableNativeFetch()) {
    process.execArgv.push('--no-experimental-fetch')
  }

  for (const hook of hooks) {
    const errors: ErrorSummary[] = []

    if (!config.hookTasks[hook]) {
      logger.warn(`no task configured for ${hook}: skipping assignment...`)
      continue
    }
    const assignment = config.hookTasks[hook]

    for (const id of assignment.tasks) {
      const pluginId = config.tasks[id]
      const Task = (await import(pluginId)).tasks[id] as TaskClass

      const options = getOptions(pluginId as OptionKey)

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any --
       * `Task` is an abstract class. Here we know it's a concrete subclass
       * but typescript doesn't, so cast it to any.
       **/
      const task = new (Task as any)(logger, id, options)

      logger.info(styles.taskHeader(`running ${styles.task(id)} task`))
      try {
        await task.run(files)
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

export { default as showHelp } from './help'
export { default as installHooks } from './install'
