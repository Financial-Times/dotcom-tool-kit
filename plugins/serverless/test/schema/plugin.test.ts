import schema from '../../src/schema'

describe('serverless plugin schema', () => {
  it('should require awsAccountId and systemCode', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "awsAccountId"
          ],
          "message": "Required"
        },
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "systemCode"
          ],
          "message": "Required"
        }
      ]],
        "success": false,
      }
    `)
  })

  it('should apply defaults', () => {
    expect(
      schema.safeParse({
        awsAccountId: '013700000000',
        systemCode: 'next-article'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "awsAccountId": "013700000000",
          "regions": [
            "eu-west-1",
          ],
          "systemCode": "next-article",
        },
        "success": true,
      }
    `)
  })

  it('should allow unexpected keys', () => {
    // well, it probably shouldn't. but it does, so it can error for the legacy options.
    expect(
      schema.safeParse({
        awsAccountId: '013700000000',
        systemCode: 'next-article',
        foo: 'bar'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "awsAccountId": "013700000000",
          "foo": "bar",
          "regions": [
            "eu-west-1",
          ],
          "systemCode": "next-article",
        },
        "success": true,
      }
    `)
  })

  it('should error on deprecated useVault option', () => {
    expect(
      schema.safeParse({
        awsAccountId: '013700000000',
        systemCode: 'next-article',
        useVault: true
      })
    ).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "custom",
          "message": "the option \\u001b[90m\\u001b[3museVault\\u001b[23m\\u001b[39m has moved to \\u001b[90m\\u001b[3moptions.tasks.\\u001b[94mServerlessRun\\u001b[39m\\u001b[90m.useDoppler\\u001b[23m\\u001b[39m",
          "path": []
        }
      ]],
        "success": false,
      }
    `)
  })

  it('should error on deprecated ports option', () => {
    expect(
      schema.safeParse({
        awsAccountId: '013700000000',
        systemCode: 'next-article',
        ports: [3137]
      })
    ).toMatchInlineSnapshot(`
      {
        "error": [ZodError: [
        {
          "code": "custom",
          "message": "the option \\u001b[90m\\u001b[3mports\\u001b[23m\\u001b[39m has moved to \\u001b[90m\\u001b[3moptions.tasks.\\u001b[94mServerlessRun\\u001b[39m\\u001b[90m.ports\\u001b[23m\\u001b[39m",
          "path": []
        }
      ]],
        "success": false,
      }
    `)
  })
})
