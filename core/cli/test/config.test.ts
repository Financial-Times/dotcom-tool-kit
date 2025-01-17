import path from 'path'
import { loadConfig } from '../src/config'
import winston, { Logger } from 'winston'
import { styles as s } from '@dotcom-tool-kit/logger'
import { format } from 'pretty-format'

const logger = winston as unknown as Logger

const removeRoots = (config) => {
  // HACK:IM:20250207 the configs that are loaded include absolute paths in
  // them which are unsuitable for snapshots (as they will differ from
  // machine-to-machine). we can't mock away the logic that sets the config
  // file paths as it's needed when loading the options schemas. we also can't
  // reliably edit the config object before passing it to Jest as it's very
  // deep and contains many circular references (this also precludes using
  // JSON.stringify.) instead let's call the same pretty-format function Jest
  // calls. i'm using similar options to what Jest uses so that the diff this
  // creates is understandable.
  const stringified = format(config, {
    escapeRegex: true,
    indent: 2,
    printFunctionName: false,
    escapeString: false,
    printBasicPrototype: false
  })
  // HACK:IM:20250207 replaceAll does exist in Node 18 but we don't need to
  // edit the tsconfig.json just for this file as test files aren't
  // type-checked anyway
  return stringified.replaceAll(`${process.cwd()}/`, '')
}

describe('loadConfig', () => {
  it('should load a config from a root', async () => {
    const config = await loadConfig(logger, {
      validate: false,
      root: path.relative(process.cwd(), path.resolve(__dirname, './files/successful'))
    })
    expect(removeRoots(config)).toMatchSnapshot()
  })

  it('should load a config from a root and validate it', async () => {
    const config = await loadConfig(logger, {
      validate: true,
      root: path.relative(process.cwd(), path.resolve(__dirname, './files/successful'))
    })

    expect(removeRoots(config)).toMatchSnapshot()
  })

  it('should load an invalid config when not validating', async () => {
    const config = await loadConfig(logger, {
      validate: false,
      root: path.relative(process.cwd(), path.resolve(__dirname, './files/conflicted'))
    })
    expect(removeRoots(config)).toMatchSnapshot()
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
