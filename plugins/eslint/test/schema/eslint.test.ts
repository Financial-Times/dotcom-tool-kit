import { schema } from '../../src/tasks/eslint'

describe('eslint schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "files": [
            "**/*.js",
          ],
        },
        "success": true,
      }
    `)
  })

  it('should allow string for files', () => {
    expect(
      schema.safeParse({
        files: 'src/**/*.ts'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "files": "src/**/*.ts",
        },
        "success": true,
      }
    `)
  })

  it('should ignore extraneous keys', () => {
    expect(
      schema.safeParse({
        configPath: 'eslint.config.js',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "configPath": "eslint.config.js",
          "files": [
            "**/*.js",
          ],
        },
        "success": true,
      }
    `)
  })
})
