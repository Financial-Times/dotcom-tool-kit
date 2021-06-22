import { runCommand } from '../'
import { isConflict } from '../conflict'
import { config } from '../config'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { Command } from '../command'

export default class LifecycleCommand implements Command {
  static description = 'run lifecycle commands'

  constructor(public argv: string[]) {
    this.argv = argv
  }

  async run(): Promise<void> {
    const missingLifecycles = this.argv.filter((id) => !config.lifecycles[id])

    if (missingLifecycles.length > 0) {
      const error = new ToolKitError(`lifecycle events ${missingLifecycles} do not exist`)
      error.details = `maybe you need to install a plugin to handle these lifecycles, or configure them in your Tool Kit configuration.

lifecycle events that are available are:
${Object.keys(config.lifecycles)
  .map((id) => `- ${id}`)
  .join('\n')}`
      throw error
    }

    for (const id of this.argv) {
      const lifecycle = config.lifecycles[id]

      if (isConflict(lifecycle)) continue

      for (const command of lifecycle.commands) {
        await runCommand(command, [])
      }
    }
  }
}
