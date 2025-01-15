import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { fork } from 'child_process'
import * as z from 'zod'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

const WebpackSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe('path to a Webpack config file. Webpack will default to `webpack.config.js`.'),
    envName: z
      .union([z.literal('production'), z.literal('development')])
      .describe("set Webpack's [mode](https://webpack.js.org/configuration/mode/)."),
    watch: z.boolean().optional().describe('run Webpack in watch mode')
  })
  .describe('Bundle code with `webpack`.')
export { WebpackSchema as schema }

export default class Webpack extends Task<{ task: typeof WebpackSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
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

    const child = fork(webpackCLIPath, args, { silent: true, execArgv, cwd })
    hookFork(this.logger, 'webpack', child)
    return waitOnExit('webpack', child)
  }
}
