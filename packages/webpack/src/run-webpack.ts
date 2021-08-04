import { fork } from 'child_process'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export default function runWebpack(argv: string[], mode: 'production' | 'development'): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = fork(webpackCLIPath, ['build', `--mode=${mode}`, ...argv])

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Webpack returned an error`))
      }
    })
  })
}
