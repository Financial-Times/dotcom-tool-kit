import path from 'path'
import { resolveRoot } from '../src/plugin/resolve-root'

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
