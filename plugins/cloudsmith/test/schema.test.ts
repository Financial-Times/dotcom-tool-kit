import schema from '../src/schema'

describe('cloudsmith plugin schema', () => {
  it('should be completely optional', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {},
        "success": true,
      }
    `)
  })
  it('should only pass through serviceAccount', () => {
    expect(
      schema.safeParse({
        serviceAccount: 'cp-platforms-read-only',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "serviceAccount": "cp-platforms-read-only",
        },
        "success": true,
      }
    `)
  })
})
