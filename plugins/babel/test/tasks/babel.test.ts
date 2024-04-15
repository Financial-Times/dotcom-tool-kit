import { beforeAll, describe, expect, it } from '@jest/globals'
import Babel from '../../src/tasks/development'
import { promises as fs } from 'fs'
import * as path from 'path'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const testDirectory = path.join(__dirname, '../files')
const outputPath = path.join(testDirectory, 'lib')

describe('babel', () => {
  let transpiledFixture: string

  beforeAll(async () => {
    transpiledFixture = await fs.readFile(path.join(testDirectory, 'fixtures/transpiled.js'), 'utf8')
  })

  it('should transpile the file', async () => {
    const task = new Babel(logger, 'Babel', {
      files: path.join(testDirectory, 'index.js'),
      outputPath,
      configFile: path.join(testDirectory, 'babel.config.json')
    })
    await task.run()
    const transpiled = await fs.readFile(path.join(outputPath, 'index.js'), 'utf8')
    expect(transpiled).toEqual(transpiledFixture)
  })
})
