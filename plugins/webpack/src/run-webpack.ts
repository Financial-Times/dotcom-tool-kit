import { fork } from 'child_process'
import { Logger } from 'winston'
import type { WebpackOptions } from '@dotcom-tool-kit/types/lib/schema/webpack'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export default function runWebpack(logger: Logger, options: WebpackOptions): Promise<void> {
  logger.info('starting Webpack...')
  const child = fork(
    webpackCLIPath,
    ['build', `--mode=${options.mode}`, options.configPath ? `--config=${options.configPath}` : ''],
    { silent: true }
  )
  hookFork(logger, 'webpack', child)
  return waitOnExit('webpack', child)
}
