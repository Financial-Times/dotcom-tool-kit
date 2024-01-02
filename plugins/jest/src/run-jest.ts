import { fork } from 'child_process'
import type { JestOptions, JestMode } from '@dotcom-tool-kit/schemas/lib/plugins/jest'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'
const jestCLIPath = require.resolve('jest-cli/bin/jest')

export default function runJest(logger: Logger, mode: JestMode, options: JestOptions): Promise<void> {
  const args = [
    '--colors',
    mode === 'ci' ? '--ci' : '',
    options.configPath ? `--config=${options.configPath}` : ''
  ]
  logger.info(`running jest ${args.join(' ')}`)
  const child = fork(jestCLIPath, args, { silent: true })
  hookFork(logger, 'jest', child)
  return waitOnExit('jest', child)
}
