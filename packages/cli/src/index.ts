import { ToolKitError } from '@dotcom-tool-kit/error'
import { TaskClass } from '@dotcom-tool-kit/task'
import { loadConfig } from './config'
import { loadPluginConfig } from './plugin'

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

  for (const hook of hooks) {
    const assignment = config.hookTasks[hook]

    for (const id of assignment.tasks) {
      const Task = config.tasks[id]
      const options = Task.plugin ? config.options[Task.plugin.id]?.options : {}

      // `Task` is an abstract class. here we know it's a concrete subclass
      // but typescript doesn't, so cast it to any
      const task = new (Task as any)(options)
      await task.run()
    }
  }
}

export { default as showHelp } from './help'
export { default as installHooks } from './install'
