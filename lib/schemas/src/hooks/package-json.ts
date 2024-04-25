import { z } from 'zod'

const CommandListSchema = z.union([z.array(z.string()), z.string()])
export const PackageJsonSchema = z.record(
  z.record(
    z.union([
      CommandListSchema,
      z.object({
        commands: CommandListSchema,
        trailingString: z.string()
      })
    ])
  )
)
  .describe(`This hook accepts a nested object with a structure that matches the generated output in \`package.json\`. The values are used as Tool Kit command names to run. You can provide a single command or an array; multiple commands are concatenated in order.

For more complex use cases, you can provide an object instead of a command. The object must contain keys \`commands\` (as above), and \`trailingString\` (which will be appended to the resulting \`dotcom-tool-kit\` CLI invocation). This is useful for tasks that accept a list of files after a trailing \`--\`.

Options provided in your repository's \`.toolkitrc.yml\` for this hook are merged with any Tool Kit plugin that also provides options for the hook.

For example, configuring this hook with the following options:

~~~yml
options:
  hooks:
    - PackageJson:
        scripts:
          start: 'run:local'
          customScript:
            commands:
              - custom:one
              - custom:two
            trailingString: '--'
~~~

will result in the following output in \`package.json\`:

~~~json
{
  "scripts": {
    "start": "dotcom-tool-kit run:local",
    "customScript": "dotcom-tool-kit custom:one custom:two --"
  }
}
~~~

<!-- hide autogenerated schema docs:
`)

export type PackageJsonOptions = z.infer<typeof PackageJsonSchema>

export const Schema = PackageJsonSchema
