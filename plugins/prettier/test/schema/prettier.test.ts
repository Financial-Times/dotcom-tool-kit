import { schema } from '../../src/tasks/prettier'

describe('prettier schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "files": [
            "**/*.{js,jsx,ts,tsx}",
          ],
          "ignoreFile": ".prettierignore",
        },
        "success": true,
      }
    `)
  })

  it('should allow through only expected keys', () => {
    expect(
      schema.safeParse({
        files: 'src/**.js',
        configFile: 'pretter.config.js',
        ignoreFile: '.eslintignore',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "configFile": "pretter.config.js",
          "files": "src/**.js",
          "ignoreFile": ".eslintignore",
        },
        "success": true,
      }
    `)
  })
})
