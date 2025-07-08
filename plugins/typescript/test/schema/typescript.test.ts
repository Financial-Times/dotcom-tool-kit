import { schema } from '../../src/tasks/typescript'

describe('typescript schema', () => {
  it('should be completely optional', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {},
        "success": true,
      }
    `)
  })

  it('should allow through only expected keys', () => {
    expect(
      schema.safeParse({
        configPath: 'tsconfig.settings.json',
        build: true,
        watch: true,
        noEmit: true,
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "build": true,
          "configPath": "tsconfig.settings.json",
          "noEmit": true,
          "watch": true,
        },
        "success": true,
      }
    `)
  })
})
