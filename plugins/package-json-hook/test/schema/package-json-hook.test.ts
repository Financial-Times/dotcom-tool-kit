import { PackageJsonSchema as schema } from '../../src/schema'

describe('package-json-hook schema', () => {
  it('parses a PackageJson hook spec', () => {
    expect(
      schema.safeParse({
        scripts: {
          run: 'run:local',
          customScript: ['custom:one', 'custom:two']
        },
        customField: {
          something: {
            commands: 'something',
            trailingString: '--'
          },
          somethingElse: {
            commands: ['something:else', 'another:thing'],
            trailingString: '&& echo hello'
          }
        }
      })
    ).toMatchInlineSnapshot(`
      {
        "data": {
          "customField": {
            "something": {
              "commands": "something",
              "trailingString": "--",
            },
            "somethingElse": {
              "commands": [
                "something:else",
                "another:thing",
              ],
              "trailingString": "&& echo hello",
            },
          },
          "scripts": {
            "customScript": [
              "custom:one",
              "custom:two",
            ],
            "run": "run:local",
          },
        },
        "success": true,
      }
    `)
  })
})
