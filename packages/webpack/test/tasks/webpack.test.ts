import { describe, jest, it } from '@jest/globals'
import { promises as fsp } from 'fs'
import * as path from 'path'
import DevelopmentWebpack from '../../src/tasks/development'
import ProductionWebpack from '../../src/tasks/production'

// Have to use a Typescript file and ts-node to resolve the config as jest
// overrides the standard node .js resolver webpack typically loads the file with.
const configPath = path.resolve(__dirname, '../files/webpack.config.ts')
const outputPath = path.resolve(__dirname, '../files/dist')

jest.setTimeout(10000)

describe('webpack', () => {
  afterEach(() => fsp.rmdir(outputPath, { recursive: true }))

  describe('development', () => {
    it('should pass on standard file', async () => {
      const task = new DevelopmentWebpack({ configPath })
      await task.run()

      await fsp.access(outputPath + '/app.bundle.js')
    })
  })

  describe('production', () => {
    it('should pass on standard file', async () => {
      const task = new ProductionWebpack({ configPath })
      await task.run()

      await fsp.access(outputPath + '/app.bundle.js')
    })
  })
})
