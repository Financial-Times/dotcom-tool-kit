import { fork } from 'child_process'
import { Transform } from 'stream'
import { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { WebpackOptions } from '@dotcom-tool-kit/types/lib/schema/webpack'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export default function runWebpack(logger: Logger, options: WebpackOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.info('starting Webpack...')
    const child = fork(
      webpackCLIPath,
      ['build', `--mode=${options.mode}`, options.configPath ? `--config=${options.configPath}` : ''],
      { silent: true }
    )

    if (!child.stdout) {
      throw new ToolKitError('failed to fork webpack process')
    }
    child.stdout.setEncoding('utf8')
    child.stdout
      .pipe(
        new Transform({
          decodeStrings: false,
          readableObjectMode: true,
          transform: (data, _enc, callback) => {
            callback(null, { level: 'info', message: data.trim() })
          }
        })
      )
      .pipe(logger.child({ process: 'webpack' }), { end: false })

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
