import { schema } from '../../src/tasks/workspace-command'

describe('monorepo workspace command schema', () => {
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
        command: 'some:command',
        packageFilter: 'packages/*',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "command": "some:command",
          "packageFilter": "packages/*",
        },
        "success": true,
      }
    `)
  })
})
