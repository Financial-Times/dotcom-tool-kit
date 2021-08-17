import { isConflict } from '../conflict'
import { config } from '../config'
import { Task } from '@dotcom-tool-kit/task'

export default class HelpCommand extends Task {
  static description = 'show this help'

  showHelp(): void {
    for (const [id, task] of Object.entries(config.tasks)) {
      if (isConflict(task) || task.hidden) continue

      console.log(`${id}\t${task.description}`)
    }
  }

  showTaskHelp(id: string): void {
    const task = config.tasks[id]
    if (isConflict(task)) return

    // TODO print argument help somehow?
    console.log(`${id}\t${task.description}`)
  }

  async run(): Promise<void> {
    const [id] = this.argv

    if (id) {
      this.showTaskHelp(id)
    } else {
      this.showHelp()
    }
  }
}
