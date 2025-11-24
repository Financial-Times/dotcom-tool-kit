import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { fork } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import * as z from 'zod'

const jestCLIPath = require.resolve('jest-cli/bin/jest')

// TODO:IM:20250407 This function has been copied wholesale to
// plugins/node-test/src/tasks/node-test.ts. There isn't a clear shared library
// to put it in but something should be worked out if it needs to be
// modified/copied again.
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

const JestSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        "Path to the [Jest config file](https://jestjs.io/docs/27.x/configuration). Use Jest's own [config resolution](https://jestjs.io/docs/configuration/) by default."
      ),
    ci: z
      .literal(true)
      .optional()
      .describe('Whether to run Jest in [CI mode](https://jestjs.io/docs/cli#--ci).')
  })
  .describe('Runs `jest` to execute tests.')
export { JestSchema as schema }

export default class Jest extends Task<{ task: typeof JestSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const args = ['--colors', this.options.configPath ? `--config=${this.options.configPath}` : '']
    const env: Record<string, string> = {}

    if (this.options.ci) {
      args.push('--ci', '--reporters=default', '--reporters=jest-junit')

      env.JEST_JUNIT_OUTPUT_DIR = 'test-results'
      env.JEST_JUNIT_ADD_FILE_ATTRIBUTE = 'true'

      // only relevant if running on CircleCI, other CI environments might handle
      // virtualisation completely differently
      if (process.env.CIRCLECI) {
        // leave one thread free for the main thread, same as the default Jest
        // logic
        const maxWorkers = (await guessCircleCiThreads()) - 1
        args.push(`--max-workers=${maxWorkers}`)
      }
    }

    this.logger.info(`running jest ${args.join(' ')}`)
    const child = fork(jestCLIPath, args, {
      silent: true,
      cwd,
      env: {
        ...env,
        ...process.env
      }
    })
    hookFork(this.logger, 'jest', child)
    return waitOnExit('jest', child)
  }
}
