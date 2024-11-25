import { describe, expect, it } from '@jest/globals'
import Babel from '../../src/tasks/babel'
import { promises as fs } from 'fs'
import * as path from 'path'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

const testDirectory = path.join(__dirname, '../files')
const outputPath = path.join(testDirectory, 'lib')

describe('babel', () => {
  it('should transpile the file', async () => {
    const task = new Babel(
      logger,
      'Babel',
      {},
      {
        envName: 'development',
        files: path.join(testDirectory, 'index.js'),
        outputPath,
        configFile: path.join(testDirectory, 'babel.config.json')
      }
    )
    await task.run({ cwd: process.cwd(), command: 'build:local' })
    const transpiled = await fs.readFile(path.join(outputPath, 'index.js'), 'utf8')
    expect(transpiled).toMatchInlineSnapshot(`
      ""use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.test = test;
      function test(x) {
        return x !== null && x !== void 0 ? x : 0;
      }"
    `)
  })
})
