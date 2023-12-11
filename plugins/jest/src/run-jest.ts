import { fork } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import type { JestOptions, JestMode } from '@dotcom-tool-kit/types/lib/schema/jest'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'
const jestCLIPath = require.resolve('jest-cli/bin/jest')

// By default Jest will choose the number of worker threads based on the number
// of reported CPUs. However, when running within Docker in CircleCI, the
// number of reported CPUs is taken from the host machine rather than the
// number of virtual CPUs your CircleCI resource class has allocated for you.
// This means that Jest will typically create far more worker threads than is
// appropriate for the CPU time that is allocated to the container, slowing
// down test times.
async function guessVCpus(): Promise<number> {
  try {
    // We can guess the number of vCPUs by reading this virtual file in the
    // cimg images running on Linux. This is a non-standard path so may well
    // not be present in other images/execution contexts so wrap everything in
    // a try/catch statement.
    const cpuShare = await readFile('/sys/fs/cgroup/cpu/cpu.shares', 'utf8')
    // the CPU share should be a multiple of 1024
    return Math.max(Math.floor(Number(cpuShare) / 1024), 2)
  } catch {
    // assume we're running on a medium resource class execution environment
    // with 2 vCPUs if we fail to find the CPU share
    return 2
  }
}

export default async function runJest(logger: Logger, mode: JestMode, options: JestOptions): Promise<void> {
  const args = ['--colors', options.configPath ? `--config=${options.configPath}` : '']
  // TODO:20231107:IM we should probably refactor this plugin to move
  // CI-specific logic to be within the CI task module
  if (mode === 'ci') {
    args.push('--ci')
    // only relevant if running on CircleCI, other CI environments might handle
    // virtualisation completely differently
    if (process.env.CIRCLECI) {
      // leave one vCPU free for the main thread, same as the default Jest
      // logic
      const maxWorkers = (await guessVCpus()) - 1
      args.push(`--max-workers=${maxWorkers}`)
    }
  }
  logger.info(`running jest ${args.join(' ')}`)
  const child = fork(jestCLIPath, args, { silent: true })
  hookFork(logger, 'jest', child)
  return waitOnExit('jest', child)
}
