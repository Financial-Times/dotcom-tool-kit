import { schema } from '../../src/tasks/node'

describe('node schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "entry": "./server/app.js",
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

  it('should only allow through expected keys', () => {
    expect(
      schema.safeParse({
        entry: 'start.js',
        args: ['--no-experimental-fetch'],
        useDoppler: false,
        ports: [3137],
        watch: true,
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "args": [
            "--no-experimental-fetch",
          ],
          "entry": "start.js",
          "ports": [
            3137,
          ],
          "useDoppler": false,
          "watch": true,
        },
        "success": true,
      }
    `)
  })
})
