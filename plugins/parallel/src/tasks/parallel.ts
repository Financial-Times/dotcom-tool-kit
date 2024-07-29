import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { styles } from '@dotcom-tool-kit/logger'
import { ParallelSchema } from '@dotcom-tool-kit/schemas/lib/tasks/parallel'
import { loadTasks } from 'dotcom-tool-kit/lib/tasks'

export default class Parallel extends Task<{ task: typeof ParallelSchema }> {
  async run({ config, files }: TaskRunContext) {
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

    const taskInstances = (await loadTasks(this.logger, tasks, config)).unwrap('tasks are invalid!')

    // uses Promise.all so the first promise to reject stops this whole task.
    // the Parallel task is intended for running multiple long-running processes
    // simultaneously, like servers or watch-mode compilers. carrying on running
    // if one has errored means you'll easily lose any error logs, and having
    // only some of these tasks still running is almost certainly not what the
    // user wants.
    await Promise.all(taskInstances.map((task) => task.run({ files, config })))
  }
}
