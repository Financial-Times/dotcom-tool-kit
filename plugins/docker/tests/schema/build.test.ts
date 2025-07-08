import { schema } from '../../src/tasks/build'

describe('docker build schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "ssh": false,
        },
        "success": true,
      }
    `)
  })

  it('should pass through only ssh', () => {
    expect(
      schema.safeParse({
        ssh: true,
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "ssh": true,
        },
        "success": true,
      }
    `)
  })
})
