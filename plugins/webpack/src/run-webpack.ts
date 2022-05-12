import { fork } from 'child_process'
import { Logger } from 'winston'
import type { WebpackOptions } from '@dotcom-tool-kit/types/lib/schema/webpack'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export interface RunWebpackOptions {
  mode: 'production' | 'development'
  watch?: boolean
}

export default function runWebpack(
  logger: Logger,
  options: WebpackOptions & RunWebpackOptions
): Promise<void> {
  logger.info('starting Webpack...')
  const args = ['build', '--color', `--mode=${options.mode}`]

  if (options.configPath) {
    args.push(`--config=${options.configPath}`)
  }

  if (options.watch) {
    args.push('--watch')
  }

  const child = fork(webpackCLIPath, args, { silent: true })
  hookFork(logger, 'webpack', child)
  return waitOnExit('webpack', child)
}
