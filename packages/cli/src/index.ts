import { ToolKitError } from '@dotcom-tool-kit/error/src'
import { validateConfig, config } from './config'
import { loadPluginConfig } from './plugin'

export async function load(): Promise<void> {
  // start loading config and child plugins, starting from the consumer app directory
  await loadPluginConfig({
    id: 'app root',
    root: process.cwd()
  })
}

export async function runTask(lifecycles: string[]): Promise<void> {
  const validConfig = await validateConfig(config)

  const availableLifecycles = Object.keys(validConfig.lifecycles)
    .sort()
    .map((id) => `- ${id}`)
    .join('\n')

  const missingLifecycles = lifecycles.filter((id) => !validConfig.lifecycles[id])

  if (missingLifecycles.length > 0) {
    const error = new ToolKitError(`lifecycle events ${missingLifecycles} do not exist`)
    error.details = `maybe you need to install a plugin to handle these lifecycles, or configure them in your Tool Kit configuration.

lifecycle events that are available are:
${availableLifecycles}`
    throw error
  }

  for (const lifecycle of lifecycles) {
    const assignment = validConfig.lifecycleAssignments[lifecycle]

    for (const id of assignment.tasks) {
      const Task = validConfig.tasks[id]
      const task = new Task(lifecycles)

      // attach any options from config files to the task instance
      if (Task.plugin && validConfig.options[Task.plugin.id]) {
        task.options = validConfig.options[Task.plugin.id].options
      }

      await task.run()
    }
  }
}
