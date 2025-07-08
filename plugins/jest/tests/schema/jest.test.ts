import { schema } from '../../src/tasks/jest'

describe('jest schema', () => {
  it('should be completely optional', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {},
        "success": true,
      }
    `)
  })

  it('should pass through only expected keys', () => {
    expect(
      schema.safeParse({
        configPath: 'jest.config.js',
        ci: true,
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "ci": true,
          "configPath": "jest.config.js",
        },
        "success": true,
      }
    `)
  })
})
