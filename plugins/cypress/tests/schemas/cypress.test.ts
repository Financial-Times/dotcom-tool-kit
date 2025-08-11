import { schema } from '../../src/tasks/cypress'

describe('cypress schema', () => {
  it('should be completely optional', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {},
        "success": true,
      }
    `)
  })

  it('should pass through only url', () => {
    expect(
      schema.safeParse({
        url: 'https://ft.com',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "url": "https://ft.com",
        },
        "success": true,
      }
    `)
  })
})
