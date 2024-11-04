import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import mapWorkspaces from '@npmcli/map-workspaces'
import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { runTasksFromConfig } from 'dotcom-tool-kit/lib/tasks'
import { ToolKitError } from '@dotcom-tool-kit/error'

const WorkspaceCommandSchema = z.object({
  command: z
    .string()
    .optional()
    .describe('A specific command to run instead of the command that ran this task.')
})
  .describe(`Runs a Tool Kit command in all workspace packages that have that command. By default, runs the command that was used to run this task.

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
export { WorkspaceCommandSchema as schema }

export default class WorkspaceCommand extends Task<{ task: typeof WorkspaceCommandSchema }> {
  async runPackageCommand(packageId: string, packagePath: string, command: string, files?: string[]) {
    const config = await loadConfig(this.logger, { root: packagePath })

    return runTasksFromConfig(this.logger.child({ packageId }), config, [command], files)
  }

  async run({ cwd, command, files }: TaskRunContext) {
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))

    const workspaces = await mapWorkspaces({ cwd, pkg })

    const results = await Promise.allSettled(
      Array.from(workspaces, ([id, packagePath]) =>
        this.runPackageCommand(id, packagePath, this.options.command ?? command, files)
      )
    )

    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      // TODO improve error messages
      const error = new ToolKitError(`error running workspace command ${this.options.command ?? command}`)
      error.details = erroredCommands.map((result) => result.reason.toString()).join('\n\n')
      throw error
    }
  }
}
