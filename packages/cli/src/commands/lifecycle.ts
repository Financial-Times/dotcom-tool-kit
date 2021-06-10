import { runCommand } from '../'
import { isConflict } from '../conflict'
import { config } from '../config'
import type { Command } from '../command'

export default class LifecycleCommand implements Command {
  static description = 'run lifecycle commands'

  constructor(public argv: string[]) {
    this.argv = argv
  }

  async run(): Promise<void> {
    for (const id of this.argv) {
      const lifecycle = config.lifecycles[id]

      if (isConflict(lifecycle)) continue

      for (const command of lifecycle.commands) {
        await runCommand(command, [])
      }
    }
  }
}
