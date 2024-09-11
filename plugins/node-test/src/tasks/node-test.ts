import { glob } from 'glob'
import { NodeTestSchema } from '@dotcom-tool-kit/schemas/lib/tasks/node-test'
import { run } from 'node:test'
import { spec } from 'node:test/reporters'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

// This is a nasty list of file patterns to maintain however it's unavoidable
// if we want to make this plugin work consistently between Node.js 20–22. In
// future (when we drop Node.js 20 support) we will be able to remove this and
// rely on the build-in patterns.
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

// We don't want to run tests against files under "node_modules"
const defaultIgnorePatterns = [
  '**/node_modules/**'
]

export default class NodeTest extends Task<{ task: typeof NodeTestSchema }> {
  async run(): Promise<void> {
    try {
      const cwd = process.cwd()
      const filePatterns = this.options.files ?? defaultFilePatterns
      const ignore = [...this.options.ignore, ...defaultIgnorePatterns];
      const files = await glob(filePatterns, { cwd, ignore })
      return new Promise((resolve, reject) => {
        run({ files })
          .on('test:fail', () => {
            reject(new ToolKitError('Tests did not pass'))
          })
          .on('test:pass', () => {
            resolve()
          })
          .compose(spec)
          .pipe(process.stdout)
      })
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
