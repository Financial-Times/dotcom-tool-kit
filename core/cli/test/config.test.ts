import path from 'path'
import { loadConfig } from '../src/config'
import winston, { Logger } from 'winston'
import { styles as s } from '@dotcom-tool-kit/logger'

// force resolveRoot to return relative paths for machine-agnostic snapshots
jest.mock('../src/plugin/resolve-root', () => {
  const {resolveRoot} = jest.requireActual('../src/plugin/resolve-root')
  return {
    resolveRoot(id: string, root: string) {
      return path.relative(process.cwd(), resolveRoot(id, root))
    }
  }
})

const logger = winston as unknown as Logger

describe('loadConfig', () => {
  it('should load a config from a root', async () => {
    await expect(
      loadConfig(logger, {
        validate: false,
        root: path.relative(process.cwd(), path.resolve(__dirname, './files/successful'))
      })
    ).resolves.toMatchSnapshot()
  })

  it('should load a config from a root and validate it', async () => {
    await expect(
      loadConfig(logger, {
        validate: true,
        root: path.relative(process.cwd(), path.resolve(__dirname, './files/successful'))
      })
    ).resolves.toMatchSnapshot()
  })

  it('should load an invalid config when not validating', async () => {
    await expect(
      loadConfig(logger, {
        validate: false,
        root: path.relative(process.cwd(), path.resolve(__dirname, './files/conflicted'))
      })
    ).resolves.toMatchSnapshot()
  })

  it('should throw an error when validating an invalid config', async () => {
    const configPromise = loadConfig(logger, {
      validate: true,
      root: path.relative(process.cwd(), path.resolve(__dirname, './files/conflicted'))
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
