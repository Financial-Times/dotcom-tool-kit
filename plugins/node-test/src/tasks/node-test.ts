import { glob } from 'glob'
import { NodeTestSchema } from '@dotcom-tool-kit/schemas/lib/tasks/node-test'
import { run } from 'node:test'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

// HACK: this is a nasty list of file patterns to maintain however it's unavoidable
// if we want to make this plugin work consistently between Node.js 18–22. In future
// (when we drop Node.js 20 support) we will be able to remove this and rely on the
// built-in patterns.
//
// See https://nodejs.org/api/test.html#running-tests-from-the-command-line
const defaultFilePatterns = [
  '**/*.test.?(c|m)js',
  '**/*-test.?(c|m)js',
  '**/*_test.?(c|m)js',
  '**/test-*.?(c|m)js',
  '**/test.?(c|m)js',
  '**/test/**/*.?(c|m)js'
]

export default class NodeTest extends Task<{ task: typeof NodeTestSchema }> {
  async run(): Promise<void> {
    // HACK: Node.js <18.17 errors cryptically because this module doesn't
    // exist. It's better to be explicit. We can switch this to a regular
    // import when we drop Node.js 18 support.
    try {
      require.resolve('node:test/reporters')
    } catch (error) {
      throw new ToolKitError('This plugin requires Node.js 18.17+')
    }
    // HACK: eslint-plugin-import doesn't seem to know this module exists
    // eslint-disable-next-line import/no-unresolved
    const { spec } = await import('node:test/reporters')

    const concurrency = this.options.concurrency || false
    const cwd = process.cwd()
    const filePatterns = this.options.files ?? defaultFilePatterns
    const forceExit = this.options.forceExit
    const ignore = ['**/node_modules/**', ...(this.options.ignore ?? [])]

    const files = await glob(filePatterns, { cwd, ignore })

    await new Promise<void>((resolve, reject) => {
      let hasFails = false
      run({ concurrency, files, forceExit })
        .on('test:fail', () => {
          hasFails = true
        })
        .compose(new spec())
        .on('close', () => {
          if (hasFails) {
            return reject(new ToolKitError('Some tests failed'))
          }
          this.logger.info('All tests passed')
          return resolve()
        })
        .pipe(process.stdout)
    })
  }
}
