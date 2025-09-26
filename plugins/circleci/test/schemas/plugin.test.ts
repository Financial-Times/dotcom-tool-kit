import schema from '../../src/schemas/plugin'

describe('circleci plugin schema', () => {
  it('should apply defaults', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {
          "cimgNodeVersions": [
            "18.19-browsers",
          ],
          "runOnTag": true,
          "tagFilterRegex": "/^v\\d+\\.\\d+\\.\\d+(-.+)?/",
        },
        "success": true,
      }
    `)
  })

  it('should allow unexpected keys', () => {
    // well, it probably shouldn't. but it does, so it can error for the legacy nodeVersion option.
    expect(
      schema.safeParse({
        foo: 'bar'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "cimgNodeVersions": [
            "18.19-browsers",
          ],
          "foo": "bar",
          "runOnTag": true,
          "tagFilterRegex": "/^v\\d+\\.\\d+\\.\\d+(-.+)?/",
        },
        "success": true,
      }
    `)
  })

  it('should error on deprecated nodeVersion option', () => {
    expect(
      schema.safeParse({
        nodeVersion: '18.19-browsers'
      })
    ).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "custom",
            "message": "the option nodeVersion has been replaced by cimgNodeVersions",
            "path": [],
          },
        ],
        "success": false,
      }
    `)
  })
})
