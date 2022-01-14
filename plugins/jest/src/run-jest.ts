import { fork } from 'child_process'
import type { JestOptions, JestMode } from '@dotcom-tool-kit/types/lib/schema/jest'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { Logger } from "winston"
const jestCLIPath = require.resolve('jest-cli/bin/jest')

export default function runJest(logger: Logger, mode: JestMode, options: JestOptions) : Promise<void> {
    return new Promise((resolve, reject) => {
        const config = [
          mode === 'ci' ? '--ci' : '', 
          options.configPath ? `--config=${options.configPath}` : ''
        ]
        const child = fork(jestCLIPath, config)
        logger.verbose(`Running: jest ${config.join(' ')}`)
        child.on('exit', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new ToolKitError(`Jest returned an error`))
          }
        })
      })
}
