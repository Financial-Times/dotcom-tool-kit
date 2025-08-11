import schema from '../../src/schema'

describe('next-router schema', () => {
  it('should require appName', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "appName"
          ],
          "message": "Required"
        }
      ]],
        "success": false,
      }
    `)
  })

  it('should only allow through appName', () => {
    expect(
      schema.safeParse({
        appName: 'next-article',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "appName": "next-article",
        },
        "success": true,
      }
    `)
  })
})
