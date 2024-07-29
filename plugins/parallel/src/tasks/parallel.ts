import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { styles } from '@dotcom-tool-kit/logger'
import { z } from 'zod'
import { loadTasks } from 'dotcom-tool-kit/lib/tasks'
import { ValidConfig } from '@dotcom-tool-kit/config'
import type { WritableDeep } from 'type-fest'

const ParallelSchema = z
  .object({
    tasks: z.array(z.record(z.record(z.unknown())))
  })
  .describe('Run Tool Kit tasks in parallel')

export { ParallelSchema as schema }

export default class Parallel extends Task<{ task: typeof ParallelSchema }> {
  async run(context: TaskRunContext) {
    const tasks = this.options.tasks.flatMap((entry) =>
      Object.entries(entry).map(([task, options]) => ({ task, options, plugin: this.plugin }))
    )

    this.logger.info(`running tasks in parallel:
${tasks
  .map(
    (task) =>
      `  - ${styles.task(task.task)} ${styles.dim(
        `(with options ${styles.code(JSON.stringify(task.options))})`
      )}`
  )
  .join('\n')}
`)

    // HACK:KB:20250619 loadTasks expects config to be mutable, in TaskRunContext it's readonly, just cast it idc
    const taskInstances = (
      await loadTasks(this.logger, tasks, context.config as WritableDeep<ValidConfig>)
    ).unwrap('tasks are invalid!')

    // uses Promise.all so the first promise to reject stops this whole task.
    // the Parallel task is intended for running multiple long-running processes
    // simultaneously, like servers or watch-mode compilers. carrying on running
    // if one has errored means you'll easily lose any error logs, and having
    // only some of these tasks still running is almost certainly not what the
    // user wants.
    await Promise.all(taskInstances.map((task) => task.run(context)))
  }
}
