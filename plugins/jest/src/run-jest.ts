import { fork } from 'child_process'
import type { JestOptions } from '@dotcom-tool-kit/types/lib/schema/jest'

const jestCLIPath = require.resolve('jest-cli/bin/jest')

export default function runJest(mode: string, options: JestOptions) : Promise<void> {
    return new Promise((resolve, reject) => {
        const config = [
          mode === 'ci' ? '--ci' : '', 
          options.configPath ? `--config=${options.configPath}` : ''
        ]
        const child = fork(jestCLIPath, config)
        console.log(`Running: jest ${config.join(' ')}`)
        child.on('exit', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Jest returned an error`))
          }
        })
      })
}
