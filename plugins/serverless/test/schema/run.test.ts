import { schema } from '../../src/tasks/run'

describe('serverless run schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "ports": [
            3001,
            3002,
            3003,
          ],
          "useDoppler": true,
        },
        "success": true,
      }
    `)
  })

  it('should allow through only expected keys', () => {
    expect(
      schema.safeParse({
        ports: [3137],
        useDoppler: false,
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "ports": [
            3137,
          ],
          "useDoppler": false,
        },
        "success": true,
      }
    `)
  })
})
