import schema from '../../src/schema'

describe('serverless plugin schema', () => {
  it('should require awsAccountId and systemCode', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "awsAccountId",
            ],
            "received": "undefined",
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "systemCode",
            ],
            "received": "undefined",
          },
        ],
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
        "error": ZodError [
          {
            "code": "custom",
            "message": "the option useVault has moved to options.tasks.ServerlessRun.useDoppler",
            "path": [],
          },
        ],
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
        "error": ZodError [
          {
            "code": "custom",
            "message": "the option ports has moved to options.tasks.ServerlessRun.ports",
            "path": [],
          },
        ],
        "success": false,
      }
    `)
  })
})
