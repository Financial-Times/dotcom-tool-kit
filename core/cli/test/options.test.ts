import { loadConfig } from '../src/config'

import * as fs from 'node:fs/promises'

import type { Valid } from '@dotcom-tool-kit/validated'
import type { Plugin } from '@dotcom-tool-kit/plugin'

import { stripAnsi } from '@relmify/jest-serializer-strip-ansi'
import winston, { type Logger } from 'winston'
import * as YAML from 'yaml'

const logger = winston as unknown as Logger

jest.mock('node:fs/promises')
const mockedFs = jest.mocked(fs)

expect.addSnapshotSerializer(stripAnsi)

// convince text editors (well, nvim) to highlight strings as YAML
const yaml = (str) => str

describe('option substitution', () => {
  it.each([
    { type: 'string', value: 'bar' },
    { type: 'number', value: 137 },
    { type: 'boolean', value: true },
    { type: 'array', value: ['apple', 'pear'] },
    { type: 'object', value: { apple: 1, pear: true } }
  ])('should substitute option tag with $type value', async ({ value }) => {
    mockedFs.readFile.mockResolvedValueOnce(
      `
options:
  plugins:
    test:
      foo: ${YAML.stringify(value, { collectionStyle: 'flow' })}
  hooks:
    - Test:
        baz: !toolkit/option 'test.foo'
`
    )

    const config = await loadConfig(logger, { validate: false, root: process.cwd() })
    const plugin = config.plugins['app root']
    expect(plugin.valid).toBe(true)
    expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.baz).toEqual(value)
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

    const config = await loadConfig(logger, { validate: false, root: process.cwd() })
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

    const config = await loadConfig(logger, { validate: false, root: process.cwd() })
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

    const config = await loadConfig(logger, { validate: false, root: process.cwd() })
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

    expect.assertions(1)
    try {
      await loadConfig(logger, { validate: false, root: process.cwd() })
    } catch (error) {
      expect(error.details).toMatchInlineSnapshot(
        `"YAML tag referencing options used at path 'options.plugins.test.foo'"`
      )
    }
  })

  it('should disallow option tag with non-string value in key position', async () => {
    mockedFs.readFile.mockResolvedValueOnce(
      yaml(`
options:
  plugins:
    test:
      foo:
        - apple
        - pear
  hooks:
    - Test:
        !toolkit/option 'test.foo': baz
`)
    )

    expect.assertions(1)
    try {
      await loadConfig(logger, { validate: false, root: process.cwd() })
    } catch (error) {
      expect(error.details).toMatchInlineSnapshot(
        `"Option 'test.foo' for the key at path 'options.hooks.0.Test' does not resolve to a string (resolved to apple,pear)"`
      )
    }
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
      await loadConfig(logger, { validate: false, root: process.cwd() })
    } catch (error) {
      expect(error.details.split('\n\n')).toHaveLength(3)
      expect(error.details).toMatchInlineSnapshot(`
        "YAML tag referencing options used at path 'options.plugins.test'

        YAML tag referencing options used at path 'options.plugins.test.foo'

        YAML tag referencing options used at path 'options.plugins.other-test.0.bar'"
      `)
    }
  })

  describe('!toolkit/env', () => {
    const varEnv = 'varEnv'

    afterEach(() => {
      delete process.env[varEnv]
    })

    it('should substitute env tag with the environment value', async () => {
      process.env[varEnv] = 'my env'
      mockedFs.readFile.mockResolvedValueOnce(
        yaml(`
options:
  hooks:
    - Test:
        baz: !toolkit/env '${varEnv}'
      `)
      )

      const config = await loadConfig(logger, { validate: false, root: process.cwd() })
      const plugin = config.plugins['app root']
      expect(plugin.valid).toBe(true)
      expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.baz).toEqual('my env')
    })

    it('should return undefined if environment variable is not present ', async () => {
      mockedFs.readFile.mockResolvedValueOnce(
        yaml(`
  options:
    hooks:
      - Test:
          baz: !toolkit/env '${varEnv}'
        `)
      )
      const config = await loadConfig(logger, { validate: false, root: process.cwd() })
      const plugin = config.plugins['app root']
      expect(plugin.valid).toBe(true)
      expect((plugin as Valid<Plugin>).value.rcFile?.options.hooks[0].Test.baz).toBeUndefined()
    })
  })
})
