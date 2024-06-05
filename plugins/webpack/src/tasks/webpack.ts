import { type WebpackSchema } from '@dotcom-tool-kit/schemas/tasks/webpack.js'
import { Task } from '@dotcom-tool-kit/base'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { fork } from 'child_process'
import { fileURLToPath } from 'url'

const webpackCLIPath = fileURLToPath(import.meta.resolve('webpack-cli/bin/cli'))

export default class Webpack extends Task<{ task: typeof WebpackSchema }> {
  async run(): Promise<void> {
    this.logger.info('starting Webpack...')
    const args = ['build', '--color', `--mode=${this.options.envName}`]

    if (this.options.configPath) {
      args.push(`--config=${this.options.configPath}`)
    }

    if (this.options.watch) {
      args.push('--watch')
    }

    let { execArgv } = process
    if (process.allowedNodeEnvironmentFlags.has('--openssl-legacy-provider')) {
      // webpack 4 uses a legacy hashing function that is no longer provided by
      // default in OpenSSL 3: https://github.com/webpack/webpack/issues/14532
      execArgv = [...execArgv, '--openssl-legacy-provider']
    }

    const child = fork(webpackCLIPath, args, { silent: true, execArgv })
    hookFork(this.logger, 'webpack', child)
    return waitOnExit('webpack', child)
  }
}
