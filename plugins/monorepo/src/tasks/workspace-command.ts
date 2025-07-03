import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { styles } from '@dotcom-tool-kit/logger'
import { minimatch } from 'minimatch'
import pluralize from 'pluralize'
import { z } from 'zod/v3'
import { runCommandsFromConfig } from 'dotcom-tool-kit/lib/tasks'
import LoadWorkspaceConfigs from '../load-workspace-configs'

const WorkspaceCommandSchema = z.object({
  command: z
    .string()
    .optional()
    .describe('A specific command to run instead of the command that ran this task.'),
  packageFilter: z
    .string()
    .optional()
    .describe(
      'By default, the command will run in every workspace command that has that command assigned to a task. This option is a glob pattern to further filter the packages the command will run on. For example, if your workspace has packages in the `plugins` and `lib` folders, set `packageFilter` to `plugins/*` to only run only in the packages in `plugins` which have a command assigned to a task.'
    )
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
  async run({ command, files }: TaskRunContext) {
    const configuredCommand = this.options.command ?? command
    const configsWithCommand = LoadWorkspaceConfigs.configs.filter(
      ({ config }) => configuredCommand in config.commandTasks
    )

    this.logger.info(`Running ${styles.command(configuredCommand)} in:
${configsWithCommand.map(({ packageId }) => `- ${styles.plugin(packageId)}`).join('\n')}
`)

    const results = await Promise.allSettled(
      configsWithCommand.map(async ({ config, packageId, root }) => {
        if (!this.options.packageFilter || minimatch(root, this.options.packageFilter)) {
          await runCommandsFromConfig(
            this.logger.child({ packageId }),
            config,
            [configuredCommand],
            files
          ).catch((error) => {
            error.name = `${styles.plugin(packageId)} → ${error.name}`
            throw error
          })
        }
      })
    )

    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      throw new AggregateError(
        erroredCommands.map((result) => result.reason),
        `${pluralize('error', erroredCommands.length, true)} running command ${styles.command(
          configuredCommand
        )} in workspace packages`
      )
    }
  }
}
