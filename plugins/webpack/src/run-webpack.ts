import { fork } from 'child_process'
import { Logger } from 'winston'
import type { WebpackOptions } from '@dotcom-tool-kit/types/lib/schema/plugins/webpack'
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

  let { execArgv } = process
  if (process.allowedNodeEnvironmentFlags.has('--openssl-legacy-provider')) {
    // webpack 4 uses a legacy hashing function that is no longer provided by
    // default in OpenSSL 3: https://github.com/webpack/webpack/issues/14532
    execArgv = [...execArgv, '--openssl-legacy-provider']
  }

  const child = fork(webpackCLIPath, args, { silent: true, execArgv })
  hookFork(logger, 'webpack', child)
  return waitOnExit('webpack', child)
}
