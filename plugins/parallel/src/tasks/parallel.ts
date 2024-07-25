import { Task } from '@dotcom-tool-kit/base'
import { ParallelSchema } from '@dotcom-tool-kit/schemas/lib/tasks/parallel'

export default class Parallel extends Task<{ task: typeof ParallelSchema }> {
  async run() {
    const tasks = this.options.tasks.flatMap((entry) =>
      Object.entries(entry).map(([task, options]) => ({ task, options }))
    )
    this.logger.info(`running tasks ${tasks.map((t) => t.task).join(', ')} in parallel`)
  }
}
