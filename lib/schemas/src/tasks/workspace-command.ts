import { z } from 'zod'

export const WorkspaceCommandSchema = z.object({
  command: z.string().optional().describe('A specific command to run instead of the command that ran this task.')
}).describe(`Runs a Tool Kit command in all workspace packages that have that command. By default, runs the command that was used to run this task.

For example, imagine a monorepo with these \`.toolkitrc.yml\` files:

<details><summary><code>.toolkitrc.yml</code></summary>

~~~yml
commands:
  run:local: WorkspaceCommand
  build:local: WorkspaceCommand
~~~

</details>

<details><summary><code>packages/api/.toolkitrc.yml</code></summary>

~~~yml
commands:
  run:local: Node
~~~

</details>

<details><summary><code>packages/client/.toolkitrc.yml</code></summary>

~~~yml
commands:
  build:local: TypeScript
~~~

</details>

<details><summary><code>packages/components/.toolkitrc.yml</code></summary>

~~~yml
commands:
  build:local: Webpack
  run:local:
    Webpack:
      watch: true
~~~

</details>

Running \`dotcom-tool-kit run:local\` at the root level will run the \`Node\` task in \`packages/api\` and the \`Webpack\` task in watch mode in \`packages/components\`; running \`dotcom-tool-kit build:local\` will run \`TypeScript\` in \`packages/client\` and \`Webpack\` in \`packages/components\`.

To run a particular command in the workspace instead of dynamically inferring the command from which was run at root level, set the \`command\` option for the task:

~~~yml
commands:
  build:ci:
    WorkspaceCommand:
      command: build:local
~~~

`)

export type WorkspaceCommandOptions = z.infer<typeof WorkspaceCommandSchema>

export const Schema = WorkspaceCommandSchema
