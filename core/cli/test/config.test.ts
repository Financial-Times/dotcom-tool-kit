import path from 'path'
import { loadConfig } from '../src/config'
import winston, { Logger } from 'winston'
import { styles as s } from '@dotcom-tool-kit/logger'

const logger = winston as unknown as Logger

const cwdMock = jest.spyOn(process, 'cwd')
const realCwd = process.cwd()

describe('loadConfig', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load a config from a root', async () => {
    cwdMock.mockReturnValueOnce(path.relative(realCwd, path.resolve(__dirname, './files/successful')))

    await expect(
      loadConfig(logger, {
        validate: false
      })
    ).resolves.toMatchSnapshot()
  })

  it('should load a config from a root and validate it', async () => {
    cwdMock.mockReturnValueOnce(path.relative(realCwd, path.resolve(__dirname, './files/successful')))

    await expect(
      loadConfig(logger, {
        validate: true
      })
    ).resolves.toMatchSnapshot()
  })

  it('should load an invalid config when not validating', async () => {
    cwdMock.mockReturnValueOnce(path.relative(realCwd, path.resolve(__dirname, './files/conflicted')))

    await expect(
      loadConfig(logger, {
        validate: false
      })
    ).resolves.toMatchSnapshot()
  })

  it('should throw an error when validating an invalid config', async () => {
    cwdMock.mockReturnValueOnce(path.relative(realCwd, path.resolve(__dirname, './files/conflicted')))

    const configPromise = loadConfig(logger, {
      validate: true
    })
    await expect(configPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"There are problems with your Tool Kit configuration."`
    )

    await expect(configPromise.catch((error) => s.strip(error.details))).resolves.toMatchInlineSnapshot(`
      "These commands are configured to run different tasks by multiple plugins:
      build:local:
      - Webpack by plugin @dotcom-tool-kit/webpack
      - Babel by plugin @dotcom-tool-kit/babel

      build:ci:
      - Webpack by plugin @dotcom-tool-kit/webpack
      - Babel by plugin @dotcom-tool-kit/babel

      build:remote:
      - Webpack by plugin @dotcom-tool-kit/webpack
      - Babel by plugin @dotcom-tool-kit/babel

      You must resolve this conflict by explicitly configuring which task to run for these commands. See https://github.com/financial-times/dotcom-tool-kit/tree/main/docs/resolving-plugin-conflicts.md for more details.

      "
    `)
  })
})
