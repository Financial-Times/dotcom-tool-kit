import * as path from 'path'
import Prettier from '../../src/tasks/prettier'
import { promises as fsp } from 'fs'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

const testDirectory = path.join(__dirname, '../files')

describe('prettier', () => {
  let unformattedFixture: string
  let formattedDefaultFixture: string
  let formattedConfigFileFixture: string

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
  })

  beforeEach(async () => {
    await fsp.writeFile(path.join(testDirectory, 'unformatted.ts'), unformattedFixture)
  })

  it('should format the file with default options', async () => {
    const task = new Prettier(
      logger,
      'Prettier',
      {},
      {
        files: [path.join(testDirectory, 'unformatted.ts')],
        ignoreFile: 'nonexistent prettierignore'
      }
    )
    await task.run({ command: 'format:local' })
    const prettified = await fsp.readFile(path.join(testDirectory, 'unformatted.ts'), 'utf8')
    expect(prettified).toEqual(formattedDefaultFixture)
  })

  it('should use configFile if present', async () => {
    // having the configuration file be named .prettierrc-test.json hides it from being found by prettier on other non-test occasions.
    const task = new Prettier(
      logger,
      'Prettier',
      {},
      {
        files: [path.join(testDirectory, 'unformatted.ts')],
        configFile: path.join(__dirname, '../.prettierrc-test.json'),
        ignoreFile: 'nonexistent prettierignore'
      }
    )

    await task.run({ command: 'format:local' })
    const prettified = await fsp.readFile(path.join(testDirectory, 'unformatted.ts'), 'utf8')
    expect(prettified).toEqual(formattedConfigFileFixture)
  })
})
