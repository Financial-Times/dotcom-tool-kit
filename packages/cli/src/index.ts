import { ToolKitError } from '@dotcom-tool-kit/error'
import { loadConfig } from './config'
import { loadPluginConfig } from './plugin'

export async function runTasks(lifecycles: string[]): Promise<void> {
  const config = await loadConfig()

  const availableLifecycles = Object.keys(config.lifecycles)
    .sort()
    .map((id) => `- ${id}`)
    .join('\n')

  const missingLifecycles = lifecycles.filter((id) => !config.lifecycles[id])

  if (missingLifecycles.length > 0) {
    const error = new ToolKitError(`lifecycle events ${missingLifecycles} do not exist`)
    error.details = `maybe you need to install a plugin to handle these lifecycles, or configure them in your Tool Kit configuration.

lifecycle events that are available are:
${availableLifecycles}`
    throw error
  }

  for (const lifecycle of lifecycles) {
    const assignment = config.lifecycleAssignments[lifecycle]

    for (const id of assignment.tasks) {
      const Task = config.tasks[id]
      const task = new Task(lifecycles)

      // attach any options from config files to the task instance
      if (Task.plugin && config.options[Task.plugin.id]) {
        task.options = config.options[Task.plugin.id].options
      }

      await task.run()
    }
  }
}

export { default as showHelp } from './help'
export { default as installLifecycles } from './install'
