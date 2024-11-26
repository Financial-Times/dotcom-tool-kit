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
        ['-e', `process.stdout.write(require.resolve(${JSON.stringify(id)}${options ? ', ' + JSON.stringify(options) : ''}))`],
        {cwd: __dirname}
      )

      if(result.error) {
        throw result.error
      }

      if(result.status) {
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
  })
})
