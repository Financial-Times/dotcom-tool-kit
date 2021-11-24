import { describe, it, expect, afterEach, beforeAll } from '@jest/globals'
import * as path from 'path'
import Prettier from '../../src/tasks/prettier'
import { promises as fsp } from 'fs'

const testDirectory = path.join(__dirname, '../files')

describe('prettier', () => {
  let unformattedFixture: string
  let formattedDefaultFixture: string
  let formattedConfigFileFixture: string
  let formattedConfigOptionsFixture: string

  beforeAll(async () => {
    unformattedFixture = await fsp.readFile(path.join(testDirectory, './fixtures/unformatted.ts'), 'utf8')
    formattedDefaultFixture = await fsp.readFile(
      path.join(testDirectory, './fixtures/formatted-default.ts'),
      'utf8'
    )
    formattedConfigFileFixture = await fsp.readFile(
      path.join(testDirectory, './fixtures/formatted-config-file.ts'),
      'utf8'
    )
    formattedConfigOptionsFixture = await fsp.readFile(
      path.join(testDirectory, './fixtures/formatted-config-options.ts'),
      'utf8'
    )
  })

  beforeEach(async () => {
    await fsp.writeFile(path.join(testDirectory, 'unformatted.ts'), unformattedFixture)
  })

  it('should format the correct file with default configOptions', async () => {
    const task = new Prettier({
      files: [path.join(testDirectory, 'unformatted.ts')]
    })
    await task.run()
    const prettified = await fsp.readFile(path.join(testDirectory, 'unformatted.ts'), 'utf8')
    expect(prettified).toEqual(formattedDefaultFixture)
  })

  it('should use configFile if present', async () => {
    // having the configuration file be named .prettierrc-test.json hides it from being found by prettier on other non-test occasions.
    const task = new Prettier({
      files: [path.join(testDirectory, 'unformatted.ts')],
      configFile: path.join(__dirname, '../.prettierrc-test.json')
    })
    await task.run()
    const prettified = await fsp.readFile(path.join(testDirectory, 'unformatted.ts'), 'utf8')
    expect(prettified).toEqual(formattedConfigFileFixture)
  })

  it('should use configOptions if configFile not found', async () => {
    const task = new Prettier({
      files: [path.join(testDirectory, 'unformatted.ts')],
      configFile: '/incorrect/.prettierrc.js',
      configOptions: {
        singleQuote: false,
        useTabs: true,
        bracketSpacing: false,
        arrowParens: 'always',
        trailingComma: 'all',
        semi: true
      }
    })
    await task.run()
    const prettified = await fsp.readFile(path.join(testDirectory, 'unformatted.ts'), 'utf8')
    expect(prettified).toEqual(formattedConfigOptionsFixture)
  })
})
