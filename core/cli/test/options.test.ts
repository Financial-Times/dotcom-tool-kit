import { loadConfig } from '../src/config.js'

import * as fs from 'node:fs/promises'

import type { Valid } from '@dotcom-tool-kit/validated'
import type { Plugin } from '@dotcom-tool-kit/plugin'

import winston, { type Logger } from 'winston'

const logger = winston as unknown as Logger

jest.mock('node:fs/promises')
const mockedFs = jest.mocked(fs)

// convince text editors (well, nvim) to highlight strings as YAML
const yaml = (str) => str

describe('option substitution', () => {
  it('should substitute option tag with option value', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      foo: bar
  hooks:
    - Test:
        baz: !toolkit/option 'test.foo'
`)
    )

    const config = await loadConfig(logger, { validate: false })
    const plugin = config.plugins['app root']
    expect(plugin.valid).toBe(true)
    expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.baz).toEqual('bar')
  })

  it('should substitute defined tag with value when defined', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      foo: bar
  hooks:
    - Test:
        !toolkit/if-defined 'test.foo':
          hello: world
`)
    )

    const config = await loadConfig(logger, { validate: false })
    const plugin = config.plugins['app root']
    expect(plugin.valid).toBe(true)
    expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.hello).toEqual('world')
  })

  it('should delete defined tag when not defined', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  hooks:
    - Test:
        !toolkit/if-defined 'test.foo':
          hello: world
`)
    )

    const config = await loadConfig(logger, { validate: false })
    const plugin = config.plugins['app root']
    expect(plugin.valid).toBe(true)
    expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.hello).toBeUndefined()
  })

  it('should support nested tags', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      foo: bar
  hooks:
    - Test:
        !toolkit/if-defined 'test.foo':
          hello: !toolkit/option 'test.foo'
`)
    )

    const config = await loadConfig(logger, { validate: false })
    const plugin = config.plugins['app root']
    expect(plugin.valid).toBe(true)
    expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.hello).toEqual('bar')
  })

  it('should disallow tags within plugin options', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      foo: !toolkit/option 'test.foo'
`)
    )

    expect(loadConfig(logger, { validate: false })).rejects.toThrowErrorMatchingInlineSnapshot(
      `"cannot reference plugin options when specifying options"`
    )
  })

  it('should print multiple invalid tags in error', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      !toolkit/if-defined 'test.foo':
        foo: !toolkit/option 'test.foo'
    other-test:
      - bar: !toolkit/option 'test.bar'
`)
    )

    expect.assertions(2)
    try {
      await loadConfig(logger, { validate: false })
    } catch (error) {
      expect(error.details.split('\n\n')).toHaveLength(3)
      expect(error.details).toMatchInlineSnapshot(`
        "YAML tag referencing options used at path 'options.plugins.test'

        YAML tag referencing options used at path 'options.plugins.test.foo'

        YAML tag referencing options used at path 'options.plugins.other-test.0.bar'"
      `)
    }
  })
})
