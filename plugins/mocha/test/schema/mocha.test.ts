import { schema } from '../../src/tasks/mocha'

describe('mocha schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "files": "test/**/*.js",
        },
        "success": true,
      }
    `)
  })

  it('should pass through only expected keys', () => {
    expect(
      schema.safeParse({
        files: '**/*.test.js',
        configPath: 'mocha.config.js',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "configPath": "mocha.config.js",
          "files": "**/*.test.js",
        },
        "success": true,
      }
    `)
  })
})
