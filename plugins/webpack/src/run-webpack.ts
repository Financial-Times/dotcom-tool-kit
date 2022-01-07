import { fork } from 'child_process'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { WebpackOptions } from '@dotcom-tool-kit/types/lib/schema/webpack'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export default function runWebpack(options: WebpackOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('starting Webpack...')
    const child = fork(webpackCLIPath, [
      'build',
      `--mode=${options.mode}`,
      options.configPath ? `--config=${options.configPath}` : ''
    ])

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        const error = new ToolKitError('Webpack returned an error')
        child.stderr?.setEncoding('utf8')
        error.details = child.stderr?.read()
        reject(error)
      }
    })
  })
}
