import { ToolKitError } from '@dotcom-tool-kit/error'
import { checkInstall, loadConfig } from './config'
import { getOptions, setOptions } from '@dotcom-tool-kit/options'
import type { Options } from '@dotcom-tool-kit/types/src/schema'
import { styles } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'

type ErrorSummary = {
  hook: string
  task: string
  error: Error
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
      setOptions(pluginOptions.forPlugin.id as any, pluginOptions.options)
    }
  }

  await checkInstall(config)

  for (const hook of hooks) {
    const errors: ErrorSummary[] = []

    if (!config.hookTasks[hook]) {
      logger.warn(`no task configured for ${hook}: skipping assignment...`)
      continue
    }
    const assignment = config.hookTasks[hook]

    for (const id of assignment.tasks) {
      const Task = config.tasks[id]
      const options = Task.plugin ? getOptions(Task.plugin.id as keyof Options) : {}

      // `Task` is an abstract class. here we know it's a concrete subclass
      // but typescript doesn't, so cast it to any.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const task = new (Task as any)(logger, options)

      try {
        await task.run(files)
      } catch (error: any) {
        // allow subsequent hook tasks to run on error
        errors.push({
          hook,
          task: id,
          error
        })
      }
    }

    if (errors.length > 0) {
      const error = new ToolKitError(`error running tasks for ${styles.hook(hook)}`)
      error.details = errors
        .map(
          ({ hook, task, error }) =>
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

export { default as showHelp } from './help'
export { default as installHooks } from './install'
