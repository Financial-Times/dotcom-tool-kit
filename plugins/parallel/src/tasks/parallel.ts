import { Task } from '@dotcom-tool-kit/base'
import { z } from 'zod'

const ParallelSchema = z
  .object({
    tasks: z.array(z.record(z.unknown()))
  })
  .describe('Run Tool Kit tasks in parallel')

export { ParallelSchema as schema }

export default class Parallel extends Task<{ task: typeof ParallelSchema }> {
  async run() {
    const tasks = this.options.tasks.flatMap((entry) =>
      Object.entries(entry).map(([task, options]) => ({ task, options }))
    )
    this.logger.info(`running tasks ${tasks.map((t) => t.task).join(', ')} in parallel`)
  }
}
