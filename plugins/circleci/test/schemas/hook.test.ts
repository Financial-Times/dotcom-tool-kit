import { CircleCiSchema as schema } from '../../src/schemas/hook'

describe('circleci hook schema', () => {
  it('should be completely optional', () => {
    expect(schema.safeParse({})).toMatchInlineSnapshot(`
      {
        "data": {},
        "success": true,
      }
    `)
  })

  describe('executors', () => {
    it('should require the name option', () => {
      expect(
        schema.safeParse({
          executors: [{}]
        })
      ).toMatchInlineSnapshot(`
        {
          "error": ZodError [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Required",
              "path": [
                "executors",
                0,
                "name",
              ],
              "received": "undefined",
            },
          ],
          "success": false,
        }
      `)
    })

    it('should pass through name and image', () => {
      expect(
        schema.safeParse({
          executors: [
            {
              name: 'executor',
              image: 'image'
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "executors": [
              {
                "image": "image",
                "name": "executor",
              },
            ],
          },
          "success": true,
        }
      `)
    })
  })

  describe('jobs', () => {
    it('should require the name field', () => {
      expect(
        schema.safeParse({
          jobs: [{}]
        })
      ).toMatchInlineSnapshot(`
        {
          "error": ZodError [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Required",
              "path": [
                "jobs",
                0,
                "name",
              ],
              "received": "undefined",
            },
          ],
          "success": false,
        }
      `)
    })

    it('should pass with name and command', () => {
      expect(
        schema.safeParse({
          jobs: [
            {
              name: 'job',
              command: 'build:ci'
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "jobs": [
              {
                "command": "build:ci",
                "name": "job",
              },
            ],
          },
          "success": true,
        }
      `)
    })

    it('should support steps with pre/post arrays of strings and records', () => {
      expect(
        schema.safeParse({
          jobs: [
            {
              name: 'job',
              command: 'run:build',
              steps: {
                pre: ['checkout', { run: { command: 'echo pre' } }],
                post: ['notify', { run: { command: 'echo post' } }]
              }
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "jobs": [
              {
                "command": "run:build",
                "name": "job",
                "steps": {
                  "post": [
                    "notify",
                    {
                      "run": {
                        "command": "echo post",
                      },
                    },
                  ],
                  "pre": [
                    "checkout",
                    {
                      "run": {
                        "command": "echo pre",
                      },
                    },
                  ],
                },
              },
            ],
          },
          "success": true,
        }
      `)
    })

    it('should support workspace options', () => {
      expect(
        schema.safeParse({
          jobs: [
            {
              name: 'job',
              command: 'build',
              workspace: {
                persist: true,
                attach: false
              }
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "jobs": [
              {
                "command": "build",
                "name": "job",
                "workspace": {
                  "attach": false,
                  "persist": true,
                },
              },
            ],
          },
          "success": true,
        }
      `)
    })

    it('should support custom field', () => {
      expect(
        schema.safeParse({
          jobs: [
            {
              name: 'job',
              command: 'cmd',
              custom: {
                foo: 'bar'
              }
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "jobs": [
              {
                "command": "cmd",
                "custom": {
                  "foo": "bar",
                },
                "name": "job",
              },
            ],
          },
          "success": true,
        }
      `)
    })
  })

  describe('workflows', () => {
    it('should require the name and jobs fields', () => {
      expect(
        schema.safeParse({
          workflows: [{}]
        })
      ).toMatchInlineSnapshot(`
        {
          "error": ZodError [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Required",
              "path": [
                "workflows",
                0,
                "name",
              ],
              "received": "undefined",
            },
          ],
          "success": false,
        }
      `)
    })

    it('should require job names and their "requires" field', () => {
      expect(
        schema.safeParse({
          workflows: [
            {
              name: 'workflow',
              jobs: [{}]
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "error": ZodError [
            {
              "code": "invalid_type",
              "expected": "string",
              "message": "Required",
              "path": [
                "workflows",
                0,
                "jobs",
                0,
                "name",
              ],
              "received": "undefined",
            },
          ],
          "success": false,
        }
      `)
    })

    it('should support valid workflow jobs', () => {
      expect(
        schema.safeParse({
          workflows: [
            {
              name: 'workflow',
              jobs: [
                {
                  name: 'build',
                  requires: ['checkout']
                },
                {
                  name: 'deploy',
                  requires: ['build'],
                  splitIntoMatrix: true,
                  runOnRelease: true,
                  custom: {
                    someKey: 'someVal'
                  }
                }
              ]
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "workflows": [
              {
                "jobs": [
                  {
                    "name": "build",
                    "requires": [
                      "checkout",
                    ],
                  },
                  {
                    "custom": {
                      "someKey": "someVal",
                    },
                    "name": "deploy",
                    "requires": [
                      "build",
                    ],
                    "runOnRelease": true,
                    "splitIntoMatrix": true,
                  },
                ],
                "name": "workflow",
              },
            ],
          },
          "success": true,
        }
      `)
    })

    it('should support custom field and runOnRelease on workflow level', () => {
      expect(
        schema.safeParse({
          workflows: [
            {
              name: 'wf',
              jobs: [
                {
                  name: 'job1',
                  requires: []
                }
              ],

              runOnRelease: true,
              custom: {
                foo: 'bar'
              }
            }
          ]
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "workflows": [
              {
                "custom": {
                  "foo": "bar",
                },
                "jobs": [
                  {
                    "name": "job1",
                    "requires": [],
                  },
                ],
                "name": "wf",
                "runOnRelease": true,
              },
            ],
          },
          "success": true,
        }
      `)
    })
  })

  describe('custom', () => {
    it('should allow arbitrary keys and values', () => {
      expect(
        schema.safeParse({
          custom: {
            anything: {
              deeply: {
                nested: {
                  structure: ['valid', true, 123]
                }
              }
            }
          }
        })
      ).toMatchInlineSnapshot(`
        {
          "data": {
            "custom": {
              "anything": {
                "deeply": {
                  "nested": {
                    "structure": [
                      "valid",
                      true,
                      123,
                    ],
                  },
                },
              },
            },
          },
          "success": true,
        }
      `)
    })
  })

  it('should pass through disableBaseConfig', () => {
    expect(
      schema.safeParse({
        disableBaseConfig: true
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "disableBaseConfig": true,
        },
        "success": true,
      }
    `)
  })
})
