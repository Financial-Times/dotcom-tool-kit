import runCLI from 'webpack-cli/lib/bootstrap'

import Module from 'module'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const originalModuleCompile = (Module as any).prototype._compile

export default function runWebpack(argv: string[], mode: 'production' | 'development'): Promise<void> {
  return runCLI([...process.argv.slice(0, 2), 'build', `--mode=${mode}`, ...argv], originalModuleCompile)
}
