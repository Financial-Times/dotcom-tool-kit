import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { glob } from 'glob'
import { fork } from 'child_process'
import * as z from 'zod'
const mochaCLIPath = require.resolve('mocha/bin/mocha')

const MochaSchema = z
  .object({
    files: z.string().default('test/**/*.js').describe('A file path glob to Mocha tests.'),
    configPath: z
      .string()
      .optional()
      .describe(
        "Path to the [Mocha config file](https://mochajs.org/#configuring-mocha-nodejs). Uses Mocha's own [config resolution](https://mochajs.org/#priorities) by default."
      ),
    ci: z.literal(true).optional().describe('Set to `true` to capture JUnit test results.')
  })
  .describe('Runs `mocha` to execute tests.')
export { MochaSchema as schema }

export default class Mocha extends Task<{ task: typeof MochaSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const files = await glob(this.options.files, { cwd })

    const args = ['--color', ...files]

    if (this.options.configPath) {
      args.unshift(`--config=${this.options.configPath}`)
    }

    if (this.options.ci) {
      args.push('--reporter mocha-junit-reporter', '--reporter-options mochaFile=./test-results/junit.xml')
    }

    this.logger.info(`running mocha ${args.join(' ')}`)
    const child = fork(mochaCLIPath, args, { silent: true, cwd })
    hookFork(this.logger, 'mocha', child)
    return waitOnExit('mocha', child)
  }
}
