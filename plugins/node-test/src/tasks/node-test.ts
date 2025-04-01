import { glob } from 'glob'
import { pipeline } from 'node:stream/promises'
import { run } from 'node:test'
// Ignored because `node:test/reporters` is available in Node.js 20 but the root ESLint config
// supports Node.js 18+. It seems overkill to add an overriding ESLint config
// eslint-disable-next-line import/no-unresolved
import { spec } from 'node:test/reporters'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { z } from 'zod'

// We need to maintain this list of file patterns if we want to make this plugin work consistently
// between Node.js 20 and 22. In future (when we drop Node.js 20 support) we will be able to remove
// this and rely on the built-in patterns.
// See https://nodejs.org/api/test.html#running-tests-from-the-command-line
const defaultFilePatterns = [
  '**/*.test.?(c|m)js',
  '**/*-test.?(c|m)js',
  '**/*_test.?(c|m)js',
  '**/test-*.?(c|m)js',
  '**/test.?(c|m)js',
  '**/test/**/*.?(c|m)js'
]

// We don't want to run tests against files under "node_modules"
const defaultIgnorePatterns = ['**/node_modules/**']

const NodeTestSchema = z
  .object({
    concurrency: z
      .number()
      .int()
      .positive()
      .or(z.boolean())
      .default(false)
      .describe(
        'The number of test processes to run in parallel. See https://nodejs.org/docs/latest-v20.x/api/test.html#runoptions'
      ),
    files: z
      .array(z.string())
      .default(defaultFilePatterns)
      .describe('Glob patterns used to find test files to run'),
    forceExit: z
      .boolean()
      .default(false)
      .describe('Whether to force exit the test process if something is holding it open'),
    ignore: z
      .array(z.string())
      .default(defaultIgnorePatterns)
      .describe('Glob patterns for files to ignore when running tests'),
    watch: z
      .boolean()
      .default(false)
      .describe(
        'Whether to run tests in "watch" mode, automatically rerunning them when related files change'
      ),
    customOptions: z
      .record(z.unknown())
      .optional()
      .describe(
        'Additional options to pass to the test runner, for those that Tool Kit does not explicitly support. See https://nodejs.org/docs/latest-v20.x/api/test.html#runoptions'
      )
  })
  .describe('Run tests via the Node.js built-in test runner')

export { NodeTestSchema as schema }

export default class NodeTest extends Task<{ task: typeof NodeTestSchema }> {
  async run({ cwd }: TaskRunContext) {
    try {
      const { concurrency, customOptions, files: filePatterns, forceExit, ignore, watch } = this.options
      const files = await glob(filePatterns, { cwd, ignore })

      let success = true
      const testStream = run(Object.assign({ concurrency, files, forceExit, watch }, customOptions))
      testStream.on('test:fail', () => {
        success = false
      })
      await pipeline(testStream, new spec(), process.stdout, { end: false })
      if (!success) {
        throw new ToolKitError('some tests did not pass, error output has been logged above ☝️')
      }
    } catch (err) {
      if (err instanceof Error) {
        const error = new ToolKitError('node test failed to run')
        error.details = err.message
        throw error
      } else {
        throw err
      }
    }
  }
}
