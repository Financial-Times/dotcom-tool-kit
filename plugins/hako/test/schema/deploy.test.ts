import { schema } from '../../src/tasks/deploy'

describe('hako deploy schema', () => {
  it('should apply defaults', () => {
    expect(
      schema.safeParse({
        environments: []
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "asReviewApp": false,
          "environments": [],
        },
        "success": true,
      }
    `)
  })

  it('should parse and transform environments', () => {
    expect(
      schema.safeParse({
        environments: ['ft-com-prod-eu']
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "asReviewApp": false,
          "environments": [
            {
              "name": "ft-com-prod-eu",
              "region": "eu",
              "stage": "prod",
            },
          ],
        },
        "success": true,
      }
    `)
  })

  it('should only pass through expected keys', () => {
    expect(
      schema.safeParse({
        asReviewApp: true,
        customEphemeralId: 'review',
        environments: ['ft-com-prod-eu'],
        another: 'key'
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "asReviewApp": true,
          "customEphemeralId": "review",
          "environments": [
            {
              "name": "ft-com-prod-eu",
              "region": "eu",
              "stage": "prod",
            },
          ],
        },
        "success": true,
      }
    `)
  })

  it('should validate environments', () => {
    expect(
      schema.safeParse({
        environments: ['invalid environment']
      })
    ).toMatchInlineSnapshot(`
      {
        "error": ZodError [
          {
            "code": "invalid_string",
            "message": "Hako environment name must end with a stage and region, e.g., -prod-eu",
            "path": [
              "environments",
              0,
            ],
            "validation": "regex",
          },
        ],
        "success": false,
      }
    `)
  })
})
