import { isConflict } from '../conflict'
import { config } from '../config'
import type { Command } from '../command'

export default class HelpCommand implements Command {
  static description = 'show this help'

  constructor(public argv: string[]) {
    this.argv = argv
  }

  showHelp(): void {
    for (const [id, command] of Object.entries(config.commands)) {
      if (isConflict(command) || command.hidden) continue

      console.log(`${id}\t${command.description}`) // eslint-disable-line no-console
    }
  }

  showCommandHelp(id: string): void {
    const command = config.commands[id]
    if (isConflict(command)) return

    // TODO print argument help somehow?
    console.log(`${id}\t${command.description}`) // eslint-disable-line no-console
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
