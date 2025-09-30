import { fork } from 'child_process'
import { hookFork, waitOnExit, styles as s } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { z } from 'zod'

const commitlintCLIPath = require.resolve('.bin/commitlint')

const CommitlintSchema = z
  .object({
    from: z
      .string()
      .optional()
      .describe(
        'The start of the commit range to lint. If neither `from` or `to` are specified, Commitlint will lint the commit message currently being edited.'
      ),
    to: z.string().optional().describe('The end of the commit range to lint.')
  })
  .describe('Lint commit messages.')

export { CommitlintSchema as schema }

export default class Commitlint extends Task<{ task: typeof CommitlintSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const args: string[] = []

    if (this.options.from) {
      args.push('--from', this.options.from)
    }

    if (this.options.to) {
      args.push('--to', this.options.to)
    }

    if (args.length === 0) {
      args.push('--edit')
    }

    this.logger.info(`running ${s.command(`commitlint ${args.join(' ')}`)}`)

    const child = fork(commitlintCLIPath, args, { silent: true, cwd })
    hookFork(this.logger, 'commitlint', child)
    return waitOnExit('commitlint', child)
  }
}
