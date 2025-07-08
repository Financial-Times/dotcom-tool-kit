import { schema } from '../../src/tasks/n-test'

describe('n-test schema', () => {
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
        browsers: ['chrome'],
        host: 'https://ft.com',
        config: 'n-test.config.js',
        interactive: true,
        header: {
          'ft-flags': 'disablePaywall:on'
        },
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "browsers": [
            "chrome",
          ],
          "config": "n-test.config.js",
          "header": {
            "ft-flags": "disablePaywall:on",
          },
          "host": "https://ft.com",
          "interactive": true,
        },
        "success": true,
      }
    `)
  })
})
