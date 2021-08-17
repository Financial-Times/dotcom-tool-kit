import { isConflict } from '../conflict'
import { config } from '../config'
import { Task } from '@dotcom-tool-kit/task'

export default class HelpCommand extends Task {
  static description = 'show this help'

  showHelp(): void {
    for (const [id, command] of Object.entries(config.commands)) {
      if (isConflict(command) || command.hidden) continue

      console.log(`${id}\t${command.description}`)
    }
  }

  showCommandHelp(id: string): void {
    const command = config.commands[id]
    if (isConflict(command)) return

    // TODO print argument help somehow?
    console.log(`${id}\t${command.description}`)
  }

  async run(): Promise<void> {
    const [id] = this.argv

    if (id) {
      this.showCommandHelp(id)
    } else {
      this.showHelp()
    }
  }
}
