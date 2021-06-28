import { promises as fsp } from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import DevelopmentWebpack from '../../src/commands/webpack/development'
import ProductionWebpack from '../../src/commands/webpack/production'

// Have to use a Typescript file and ts-node to resolve the config as jest
// overrides the standard node .js resolver webpack typically loads the file with.
const configPath = path.resolve(__dirname, '../files/webpack.config.ts')
const outputPath = path.resolve(__dirname, '../files/dist')

jest.setTimeout(4000)

describe.each([DevelopmentWebpack, ProductionWebpack])('%p', (Webpack) => {
  afterEach(() => fsp.rmdir(outputPath, { recursive: true }))

  it('should pass on standard file', async () => {
    const command = new Webpack(['--config', configPath])
    // Intentionally skip awaiting on webpack command as it will never resolve
    // because of a webpack bug: https://github.com/webpack/webpack-cli/issues/2795
    command.run()
    await promisify(setTimeout)(2000)

    await fsp.access(outputPath + '/app.bundle.js')
  })
})
