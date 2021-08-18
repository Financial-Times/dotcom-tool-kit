import { fork } from 'child_process'

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

export default function runWebpack(mode: 'production' | 'development'): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = fork(webpackCLIPath, ['build', `--mode=${mode}`])

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Webpack returned an error`))
      }
    })
  })
}
