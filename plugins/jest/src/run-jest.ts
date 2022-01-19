import { fork } from 'child_process'
import type { JestOptions, JestMode } from '@dotcom-tool-kit/types/lib/schema/jest'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import type { Logger } from "winston"
const jestCLIPath = require.resolve('jest-cli/bin/jest')

export default function runJest(logger: Logger, mode: JestMode, options: JestOptions) : Promise<void> {
    const config = [
      mode === 'ci' ? '--ci' : '',
      options.configPath ? `--config=${options.configPath}` : ''
    ]
    logger.verbose(`Running: jest ${config.join(' ')}`)
    const child = fork(jestCLIPath, config)
    hookFork(logger, "jest", child);
    return waitOnExit("jest", child)
}
