import { ToolKitError } from '@dotcom-tool-kit/error'
import { loadConfig } from './config'
import { styles } from './messages'

type ErrorSummary = {
  hook: string
  task: string
  error: Error
}

export async function runTasks(hooks: string[]): Promise<void> {
  const config = await loadConfig()

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

  const errors: ErrorSummary[] = []

  for (const hook of hooks) {
    if (!config.hookTasks[hook]) {
      console.warn(styles.warning(`no task configured for ${hook}: skipping assignment...}`))
      continue
    }
    const assignment = config.hookTasks[hook]

    for (const id of assignment.tasks) {
      const Task = config.tasks[id]
      const options = Task.plugin ? config.options[Task.plugin.id]?.options : {}

      // `Task` is an abstract class. here we know it's a concrete subclass
      // but typescript doesn't, so cast it to any.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const task = new (Task as any)(options)

      try {
        await task.run()
      } catch (error: any) {
        // allow subsequent hook tasks to run on error
        errors.push({
          hook,
          task: id,
          error
        })
      }
    }
  }

  if (errors.length > 0) {
    const error = new ToolKitError(`there were errors from your tasks`)
    error.details = errors
      .map(
        ({ hook, task, error }) =>
          `${styles.heading(`${styles.task(task)} (from hook ${styles.hook(hook)}):`)}

${error.message}` +
          (error instanceof ToolKitError
            ? `

${error.details}`
            : '')
      )
      .join(`\n${styles.dim(styles.ruler())}\n`)

    error.exitCode = errors.length + 1
    throw error
  }
}

export { default as showHelp } from './help'
export { default as installHooks } from './install'
