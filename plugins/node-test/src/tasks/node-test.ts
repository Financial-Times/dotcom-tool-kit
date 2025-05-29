import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import { run } from 'node:test'
// Ignored because `node:test/reporters` is available in Node.js 20 but the root ESLint config
// supports Node.js 18+. It seems overkill to add an overriding ESLint config
// eslint-disable-next-line import/no-unresolved
import { spec } from 'node:test/reporters'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { createWritableLogger } from '@dotcom-tool-kit/logger'
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

// TODO:IM:20250407 This function has been copied wholesale from
// plugins/jest/src/tasks/jest.ts. There isn't a clear shared library to put it
// in but something should be worked out if it needs to be modified/copied
// again.
//
// By default Jest will choose the number of worker threads based on the number
// of reported CPUs. However, when running within Docker in CircleCI, the
// number of reported CPUs is taken from the host machine rather than the
// number of virtual CPUs your CircleCI resource class has allocated for you.
// This means that Jest will typically create far more worker threads than is
// appropriate for the CPU time that is allocated to the container, slowing
// down test times.
async function guessCircleCiThreads(): Promise<number> {
  try {
    // Machines running cgroupv1 should export the number of physical cores in
    // a virtual file. This file is not exported when using cgroupv2 so can be
    // also used as a way to ascertain which API is currently being used.
    const cpuShare = await readFile('/sys/fs/cgroup/cpu/cpu.shares', 'utf8')
    // the CPU share should be a multiple of 1024
    const coreCount = Math.max(Math.floor(Number(cpuShare) / 1024), 1)
    // double the core count to account for the two logical cores available on
    // each physical core
    return coreCount * 2
  } catch {
    try {
      // machines using cgroupv2 will only list the procinfo for the logical
      // cores available to us
      const procFile = await readFile('/proc/cpuinfo', 'utf8')
      return procFile.split('\n').filter((line) => line.includes('processor')).length
    } catch {
      // assume we're running on a medium resource class execution environment
      // with 2 vCPUs with 2 logical cores each if we fail to find the CPU
      // share
      return 4
    }
  }
}

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
    const { customOptions, files: filePatterns, forceExit, ignore, watch } = this.options
    let { concurrency } = this.options
    // the default concurrency limit needs to be corrected in CircleCI
    if (concurrency === true && process.env.CIRCLECI) {
      concurrency = (await guessCircleCiThreads()) - 1
    }
    const files = await glob(filePatterns, { cwd, ignore })

    let success = true
    const testStream = run(Object.assign({ concurrency, files, forceExit, watch }, customOptions))
    testStream.on('test:fail', () => {
      success = false
    })

    await pipeline(testStream, new spec(), createWritableLogger(this.logger, 'node-test'))
    if (!success) {
      throw new ToolKitError('some tests did not pass, error output has been logged above ☝️')
    }
  }
}
