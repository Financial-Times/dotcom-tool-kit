import { schema } from '../../src/tasks/delete'

describe('hako delete schema', () => {
  it('should require all keys', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "appName",
            ],
            "received": "undefined",
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "ephemeralId",
            ],
            "received": "undefined",
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "message": "Required",
            "path": [
              "environment",
            ],
            "received": "undefined",
          },
        ],
        "success": false,
      }
    `)
  })

  it('should only pass through expected keys', () => {
    expect(
      schema.safeParse({
        appName: 'app',
        ephemeralId: 'review',
        environment: 'ft-com-prod-eu',
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "appName": "app",
          "environment": {
            "name": "ft-com-prod-eu",
            "region": "eu",
            "stage": "prod",
          },
          "ephemeralId": "review",
        },
        "success": true,
      }
    `)
  })

  it('should validate environment', () => {
    expect(
      schema.safeParse({
        appName: 'app',
        ephemeralId: 'review',
        environment: 'invalid environment'
      })
    ).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_string",
            "message": "Hako environment name must end with a stage and region, e.g., -prod-eu",
            "path": [
              "environment",
            ],
            "validation": "regex",
          },
        ],
        "success": false,
      }
    `)
  })
})
