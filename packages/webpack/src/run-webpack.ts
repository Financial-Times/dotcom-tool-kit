import { fork } from 'child_process'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export type WebpackOptions = {
  configPath?: string
  mode: 'production' | 'development'
}

export default function runWebpack(options: WebpackOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = fork(webpackCLIPath, [
      'build',
      `--mode=${options.mode}`,
      options.configPath ? `--config=${options.configPath}` : ''
    ])

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Webpack returned an error`))
      }
    })
  })
}
