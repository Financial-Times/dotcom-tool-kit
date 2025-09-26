import { schema } from '../../src/tasks/node-test'

describe('node-test schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "concurrency": false,
          "files": [
            "**/*.test.?(c|m)js",
            "**/*-test.?(c|m)js",
            "**/*_test.?(c|m)js",
            "**/test-*.?(c|m)js",
            "**/test.?(c|m)js",
            "**/test/**/*.?(c|m)js",
          ],
          "forceExit": false,
          "ignore": [
            "**/node_modules/**",
          ],
          "watch": false,
        },
        "success": true,
      }
    `)
  })

  it('should only allow positive integers for concurrency', () => {
    expect(
      schema.safeParse({
        concurrency: 13.7
      })
    ).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_type",
            "expected": "integer",
            "message": "Expected integer, received float",
            "path": [
              "concurrency",
            ],
            "received": "float",
          },
        ],
        "success": false,
      }
    `)

    expect(
      schema.safeParse({
        concurrency: -137
      })
    ).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "too_small",
            "exact": false,
            "inclusive": false,
            "message": "Number must be greater than 0",
            "minimum": 0,
            "path": [
              "concurrency",
            ],
            "type": "number",
          },
        ],
        "success": false,
      }
    `)
  })

  it('should only allow through expected keys', () => {
    expect(
      schema.safeParse({
        concurrency: 137,
        files: ['**/*.test.js'],
        forceExit: true,
        ignore: ['plugins/node-test/fixtures/*'],
        watch: true,
        customOptions: {
          timeout: 1370
        },
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "concurrency": 137,
          "customOptions": {
            "timeout": 1370,
          },
          "files": [
            "**/*.test.js",
          ],
          "forceExit": true,
          "ignore": [
            "plugins/node-test/fixtures/*",
          ],
          "watch": true,
        },
        "success": true,
      }
    `)
  })
})
