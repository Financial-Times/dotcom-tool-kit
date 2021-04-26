// @ts-ignore
import runCLI from 'webpack-cli/lib/bootstrap'

import Module from 'module';
const originalModuleCompile = (Module as any).prototype._compile

export default function runWebpack(argv: string[], mode: 'production' | 'development') {
   runCLI(
      [...process.argv.slice(0, 2), 'build', `--mode=${mode}`, ...argv],
      originalModuleCompile
   )
}
