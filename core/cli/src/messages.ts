import { styles as s, styles } from '@dotcom-tool-kit/logger'
import type { Hook } from '@dotcom-tool-kit/base'
import type {
  CommandTask,
  EntryPoint,
  Plugin,
  OptionsForPlugin,
  OptionsForTask
} from '@dotcom-tool-kit/plugin'
import type { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import type { Conflict } from '@dotcom-tool-kit/conflict'
import pluralize from 'pluralize'
import { ToolKitError } from '@dotcom-tool-kit/error'

const formatTaskConflict = ([key, conflict]: [string, Conflict<EntryPoint>]): string =>
  `- ${s.task(key ?? 'unknown task')} ${s.dim('from plugins')} ${conflict.conflicting
    .map((entryPoint) => s.plugin(entryPoint.plugin.id ?? 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatTaskConflicts = (conflicts: [string, Conflict<EntryPoint>][]): string => `${s.heading(
  'There are multiple plugins that include the same tasks'
)}:
${conflicts.map(formatTaskConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatHookConflict = ([key, conflict]: [string, Conflict<EntryPoint>]): string =>
  `- ${s.hook(key ?? 'unknown hook')} ${s.dim('from plugins')} ${conflict.conflicting
    .map((entryPoint) => s.plugin(entryPoint.plugin.id ?? 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatHookConflicts = (conflicts: [string, Conflict<EntryPoint>][]): string => `${s.heading(
  'There are multiple plugins that include the same hooks'
)}:
${conflicts.map(formatHookConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatCommandTaskConflict = (conflict: Conflict<CommandTask>): string => `${s.command(
  conflict.conflicting[0].id
)}:
${conflict.conflicting
  .map(
    (command) =>
      `- ${command.tasks.map((task) => s.task(task.task)).join(s.dim(', '))} ${s.dim('by plugin')} ${s.plugin(
        command.plugin.id
      )}`
  )
  .join('\n')}
`

export const formatCommandTaskConflicts = (conflicts: Conflict<CommandTask>[]): string => `${s.heading(
  'These commands are configured to run different tasks by multiple plugins'
)}:
${conflicts.map(formatCommandTaskConflict).join('\n')}
You must resolve this conflict by explicitly configuring which task to run for these commands. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/docs/resolving-plugin-conflicts.md'
)} for more details.

`

const formatPluginOptionConflict = (conflict: Conflict<OptionsForPlugin>): string => `${s.plugin(
  conflict.conflicting[0].forPlugin.id
)}, configured by:
${conflict.conflicting.map((option) => `- ${s.plugin(option.plugin.id)}`)}`

export const formatPluginOptionConflicts = (conflicts: Conflict<OptionsForPlugin>[]): string => `${s.heading(
  'These plugins have conflicting options'
)}:

${conflicts.map(formatPluginOptionConflict).join('\n')}

You must resolve this conflict by providing options in your app's Tool Kit configuration for these plugins, or installing a use-case plugin that provides these options. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/readme.md#options'
)} for more details.

`

const formatTaskOptionConflict = (conflict: Conflict<OptionsForTask>): string => `${s.task(
  conflict.conflicting[0].task
)}, configured by:
${conflict.conflicting.map((option) => `- ${s.plugin(option.plugin.id)}`)}`

export const formatTaskOptionConflicts = (conflicts: Conflict<OptionsForTask>[]): string => `${s.heading(
  'These tasks have conflicting options'
)}:

${conflicts.map(formatTaskOptionConflict).join('\n')}

You must resolve this conflict by providing options in your app's Tool Kit configuration for these tasks, or installing a use-case plugin that provides these options. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/readme.md#options'
)} for more details.

`

const formatPlugin = (plugin: Plugin): string =>
  plugin.id === 'app root' ? s.app('your app') : `plugin ${s.plugin(plugin.id)}`

export type InvalidOption = [string, z.ZodError]

export const formatInvalidOption = ([id, error]: InvalidOption): string =>
  fromZodError(error, { prefix: `${s.warning(pluralize('issue', error.issues.length, true))} in ${s.plugin(id)}`, prefixSeparator: ':\n- ', issueSeparator: '\n- ' }).message

export const formatInvalidPluginOptions = (
  invalidOptions: InvalidOption[]
): string => `Please update the options so that they are the expected types.
${invalidOptions.map(([plugin, error]) => formatInvalidOption([s.plugin(plugin), error])).join('\n')}

You can refer to the README for the plugin for examples and descriptions of the options used.`

export const formatUnusedPluginOptions = (
  unusedOptions: string[],
  definedPlugins: string[]
): string => `Options are defined in your Tool Kit configuration for plugins that don't exist:

${unusedOptions.map((optionName) => `- ${s.plugin(optionName)}`).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't installed in this app.

${
  definedPlugins.length > 0
    ? `Plugins that are defined and can have options set are: ${definedPlugins
        .map((plugin) => s.plugin(plugin))
        .join(', ')}`
    : `There are no plugins installed currently. You'll need to install some plugins before options can be set.`
}.
`

export const formatUnusedTaskOptions = (
  unusedOptions: string[],
  definedTasks: string[]
): string => `Options are defined in your Tool Kit configuration for tasks that don't exist:

${unusedOptions.map((optionName) => `- ${s.task(optionName)}`).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't installed in this app.

${
  definedTasks.length > 0
    ? `Task that are defined and can have options set are: ${definedTasks
        .map((task) => s.task(task))
        .join(', ')}`
    : `You don't have currently any plugins installed that provide tasks. You'll need to install some plugins before options can be set.`
}.
`

export const formatUnusedHookOptions = (
  unusedOptions: string[],
  definedHooks: string[]
): string => `Options are defined in your Tool Kit configuration for hooks that don't exist:

${unusedOptions.map((optionName) => `- ${s.hook(optionName)}`).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't installed in this app.

${
  definedHooks.length > 0
    ? `Hooks that are defined and can have options set are: ${definedHooks
        .map((hook) => s.hook(hook))
        .join(', ')}`
    : `You don't have currently any plugins installed that provide hooks. You'll need to install some plugins before options can be set.`
}.
`

export const formatUninstalledHooks = (
  uninstalledHooks: Hook[]
): string => `These hooks aren't installed into your app:

${uninstalledHooks.map((hook) => `- ${s.hook(hook.id || 'unknown event')}`).join('\n')}

Run ${s.task('dotcom-tool-kit --install')} to install these hooks.
`

type Missing = { command: CommandTask; tasks: OptionsForTask[] }

const formatMissingTask = (missing: Missing): string =>
  `- ${missing.tasks.map((task) => s.task(task.task)).join(', ')} ${s.dim(
    `(assigned to ${s.command(missing.command.id)} by ${formatPlugin(missing.command.plugin)})`
  )}`

export const formatMissingTasks = (
  missingTasks: Missing[],
  tasks: string[]
): string => `These tasks don't exist, but are configured to run from commands:

${missingTasks.map(formatMissingTask).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't used by this app.

Available tasks are: ${tasks.map((task) => s.task(task)).join(', ')}.
`

export function formatPluginTree(plugin: Plugin): string[] {
  return [
    styles.plugin(plugin.id),
    ...(plugin.children ?? []).flatMap((child: Plugin, childIndex: number, children: Plugin[]) =>
      formatPluginTree(child).map((line: string, lineIndex: number) =>
        lineIndex === 0
          ? childIndex === children.length - 1
            ? `└ ${line}`
            : `├ ${line}`
          : childIndex === children.length - 1
          ? `  ${line}`
          : `│ ${line}`
      )
    )
  ]
}

export const indentReasons = (reasons: string): string => reasons.replace(/\n/g, '\n  ')

export function formatError(error: Error) {
	let output = `${styles.error(error.name)}: ${error.message}\n`

	if(error instanceof AggregateError) {
		output += error.errors
			.map(formatError)
			.map((message, messageIndex) => {
				const lines = message.split('\n')

        // TODO:KB:20241125 refactor the tree formatter from this and formatPluginTree into a shared function
				return lines.map(
					(line, lineIndex) => (
						messageIndex === error.errors.length - 1 ? (
							lineIndex === 0 ? '╰─' : '  '
						) : lineIndex === 0 ? '├─' : '│ '
					) + line
				).join('\n')
			})
			.join('\n')
	} else if(error instanceof ToolKitError) {
		if(error.details) {
			output += styles.info(error.details)
		}
	} else if(error.stack) {
		output += error.stack.split('\n').slice(1).join('\n')
	}

	return output + '\n'
}
