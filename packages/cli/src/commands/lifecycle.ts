import { Command } from '@dotcom-tool-kit/command'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { runCommand } from '../'
import { config } from '../config'
import { isConflict } from '../conflict'

export default class LifecycleCommand extends Command {
  static description = 'run lifecycle commands'

  async run(): Promise<void> {
    const availableLifecycles = Object.keys(config.lifecycles)
      .sort()
      .map((id) => `- ${id}`)
      .join('\n')

    if (this.argv.length === 0) {
      console.log(`Available lifecycle events:\n${availableLifecycles}`)
    }

    const missingLifecycles = this.argv.filter((id) => !config.lifecycles[id])

    if (missingLifecycles.length > 0) {
      const error = new ToolKitError(`lifecycle events ${missingLifecycles} do not exist`)
      error.details = `maybe you need to install a plugin to handle these lifecycles, or configure them in your Tool Kit configuration.

lifecycle events that are available are:
${availableLifecycles}`
      throw error
    }

    for (const id of this.argv) {
      const lifecycle = config.lifecycleAssignments[id]

      if (isConflict(lifecycle)) continue

      for (const command of lifecycle.commands) {
        await runCommand(command, [])
      }
    }
  }
}
