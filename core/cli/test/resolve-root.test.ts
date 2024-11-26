import path from 'path'
import { resolveRoot } from '../src/plugin/resolve-root'

// HACK:KB:20241126 Jest's require.resolve implementation works differently from Node's
// when provided the `paths` option, in a way that let our tests pass but didn't work in
// Node. there's no way to use Node's actual implementation of require.resolve in Jest,
// so we need to call Node as a subprocess and have it run require.resolve for us.
// https://github.com/jestjs/jest/issues/9502
jest.mock('../src/plugin/require-resolve', () => {
  const { spawnSync } = jest.requireActual('child_process')

  return {
    resolve: (id: string, options?: { paths?: string[] }) => {
      const result = spawnSync(
        'node',
        [
          '-e',
          `try { process.stdout.write(require.resolve(${JSON.stringify(id)}${
            options ? ', ' + JSON.stringify(options) : ''
          })) } catch(e) { if(e.code === 'MODULE_NOT_FOUND') { process.exit(153) } else { throw e } }`
        ],
        { cwd: __dirname }
      )

      if (result.error) {
        throw result.error
      }

      if (result.status) {
        if (result.status === 153) {
          const error = new Error(`Cannot find module '${id}'`)
          ;(error as any).code = 'MODULE_NOT_FOUND'
          throw error
        }

        throw new Error(result.stderr.toString())
      }

      return result.stdout.toString('utf8')
    }
  }
})

describe('plugin loading', () => {
  describe('resolveRoot', () => {
    it('should resolve a plugin specified as a node_module', () => {
      expect(resolveRoot('@dotcom-tool-kit/heroku', process.cwd())).toEqual(
        path.resolve(__dirname, '../../../plugins/heroku')
      )
    })

    it('should resolve a plugin specified as a relative path without an index.js', () => {
      // i promise you, this test really isn't as expect(true).toEqual(true) as it looks
      expect(resolveRoot('./files/successful', __dirname)).toEqual(
        path.resolve(__dirname, './files/successful')
      )
    })

    it('should resolve a plugin specified as a relative path with an index.js', () => {
      expect(resolveRoot('./files/with-index', __dirname)).toEqual(
        path.resolve(__dirname, './files/with-index')
      )
    })

    it('should resolve a plugin specified as a parent relative path', () => {
      expect(resolveRoot('../test/files/with-index', __dirname)).toEqual(
        path.resolve(__dirname, './files/with-index')
      )
    })

    it(`should fail to resolve a node_module plugin that doesn't exist`, () => {
      expect(() => {
        resolveRoot('@dotcom-tool-kit/this-plugin-does-not-exist', '.')
      }).toThrow(
        expect.objectContaining({
          message: expect.stringMatching(
            /Couldn't resolve plugin.+@dotcom-tool-kit\/this-plugin-does-not-exist/
          ),
          details: expect.stringMatching(
            /If this is a built-in Tool Kit plugin, check it's installed as a dependency./
          )
        })
      )
    })

    it(`should fail to resolve a relative path that doesn't exist`, () => {
      expect(() => {
        resolveRoot('./files/this-file-does-not-exist', '.')
      }).toThrow(
        expect.objectContaining({
          message: expect.stringMatching(/Couldn't resolve plugin.+.\/files\/this-file-does-not-exist/),
          details: expect.stringMatching(
            /If this is a built-in Tool Kit plugin, check it's installed as a dependency./
          )
        })
      )
    })

    it(`should fail to resolve a parent relative path that doesn't exist`, () => {
      expect(() => {
        resolveRoot('../test/files/this-file-does-not-exist', '.')
      }).toThrow(
        expect.objectContaining({
          message: expect.stringMatching(
            /Couldn't resolve plugin.+..\/test\/files\/this-file-does-not-exist/
          ),
          details: expect.stringMatching(
            /If this is a built-in Tool Kit plugin, check it's installed as a dependency./
          )
        })
      )
    })
  })
})
