import { schema } from '../../src/tasks/webpack'

describe('webpack schema', () => {
  it('should require envName', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_union",
            "message": "Invalid input",
            "path": [
              "envName",
            ],
            "unionErrors": [
              ZodError [
                {
                  "code": "invalid_literal",
                  "expected": "production",
                  "message": "Invalid literal value, expected "production"",
                  "path": [
                    "envName",
                  ],
                  "received": undefined,
                },
              ],
              ZodError [
                {
                  "code": "invalid_literal",
                  "expected": "development",
                  "message": "Invalid literal value, expected "development"",
                  "path": [
                    "envName",
                  ],
                  "received": undefined,
                },
              ],
            ],
          },
        ],
        "success": false,
      }
    `)
  })

  it('should allow through only expected keys', () => {
    expect(
      schema.safeParse({
        configPath: 'webpack.config.js',
        envName: 'production',
        watch: true
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "configPath": "webpack.config.js",
          "envName": "production",
          "watch": true,
        },
        "success": true,
      }
    `)
  })
})
