import { schema } from '../../src/tasks/webpack'

describe('webpack schema', () => {
  it('should require envName', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "invalid_union",
          "unionErrors": [
            {
              "issues": [
                {
                  "code": "invalid_literal",
                  "expected": "production",
                  "path": [
                    "envName"
                  ],
                  "message": "Invalid literal value, expected \\"production\\""
                }
              ],
              "name": "ZodError"
            },
            {
              "issues": [
                {
                  "code": "invalid_literal",
                  "expected": "development",
                  "path": [
                    "envName"
                  ],
                  "message": "Invalid literal value, expected \\"development\\""
                }
              ],
              "name": "ZodError"
            }
          ],
          "path": [
            "envName"
          ],
          "message": "Invalid input"
        }
      ]],
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
