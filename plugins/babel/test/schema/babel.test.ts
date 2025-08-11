import { schema } from '../../src/tasks/babel'

describe('babel schema', () => {
  it('should require envname', () => {
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

  it('should apply defaults', () => {
    expect(
      schema.safeParse({
        envName: 'production'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "envName": "production",
          "files": "src/**/*.js",
          "outputPath": "lib",
        },
        "success": true,
      }
    `)
  })

  it('should pass through all options without extras', () => {
    expect(
      schema.safeParse({
        files: 'lib/**/*.js',
        outputPath: 'dist',
        configFile: 'babel.config.js',
        envName: 'production',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "configFile": "babel.config.js",
          "envName": "production",
          "files": "lib/**/*.js",
          "outputPath": "dist",
        },
        "success": true,
      }
    `)
  })
})
