import colours from 'ansi-colors'

import type { PluginOptions } from './config'
import type { Conflict } from './conflict'
import type { HookTask, HookClass } from './hook'
import { Plugin } from './plugin'
import type { TaskClass } from '@dotcom-tool-kit/task'

// consistent styling use cases for terminal colours
// don't use ansi-colors directly, define a style please
const s = {
  hook: colours.magenta,
  task: colours.blueBright,
  plugin: colours.cyan,
  URL: colours.cyan.underline,
  app: colours.green,
  heading: colours.bold,
  dim: colours.grey
}

const formatTaskConflict = (conflict: Conflict<TaskClass>): string =>
  `- ${s.task(conflict.conflicting[0].id || 'unknown task')} ${s.dim(
    'from plugins'
  )} ${conflict.conflicting
    .map((task) => s.plugin(task.plugin ? task.plugin.id : 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatTaskConflicts = (conflicts: Conflict<TaskClass>[]): string => `${s.heading(
  'There are multiple plugins that include the same tasks'
)}:
${conflicts.map(formatTaskConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatHookConflict = (conflict: Conflict<HookClass>): string =>
  `- ${s.hook(conflict.conflicting[0].id || 'unknown event')} ${s.dim(
    'from plugins'
  )} ${conflict.conflicting
    .map((task) => s.plugin(task.plugin ? task.plugin.id : 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatHookConflicts = (conflicts: Conflict<HookClass>[]): string => `${s.heading(
  'There are multiple plugins that include the same hooks'
)}:
${conflicts.map(formatHookConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatHookTaskConflict = (conflict: Conflict<HookTask>): string => `${s.hook(
  conflict.conflicting[0].id
)}:
${conflict.conflicting
  .map(
    (hook) =>
      `- ${hook.tasks.map(s.task).join(s.dim(', '))} ${s.dim('by plugin')} ${s.plugin(hook.plugin.id)}`
  )
  .join('\n')}
`

export const formatHookTaskConflicts = (conflicts: Conflict<HookTask>[]): string => `${s.heading(
  'These hooks are configured to run different tasks by multiple plugins'
)}:
${conflicts.map(formatHookTaskConflict).join('\n')}
You must resolve this conflict by explicitly configuring which task to run for these hooks. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/docs/resolving-hook-conflicts.md'
)} for more details.

`

const formatOptionConflict = (conflict: Conflict<PluginOptions>): string => `${s.plugin(
  conflict.conflicting[0].forPlugin.id
)}, configured by:
${conflict.conflicting.map((option) => `- ${s.plugin(option.plugin.id)}`)}`

export const formatOptionConflicts = (conflicts: Conflict<PluginOptions>[]): string => `${s.heading(
  'These plugins have conflicting options'
)}:

${conflicts.map(formatOptionConflict).join('\n')}

You must resolve this conflict by providing options in your app's Tool Kit configuration for these plugins, or installing a use-case plugin that provides these options. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/readme.md#options'
)} for more details.

`

const formatPlugin = (plugin: Plugin): string =>
  plugin.id === 'app root' ? s.app('your app') : `plugin ${s.plugin(plugin.id)}`

// TODO text similarity "did you mean...?"
export const formatUndefinedHookTasks = (
  undefinedHooks: HookTask[],
  definedHooks: string[]
): string => `These hooks don't exist, but are configured to run tasks:

${undefinedHooks.map((hook) => `- ${s.hook(hook.id)} assigned by ${formatPlugin(hook.plugin)}`).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't used by this app.

Available hooks are: ${definedHooks.map(s.hook).join(', ')}.
`

export const formatUninstalledHooks = (
  uninstalledHooks: HookClass[]
): string => `These hooks aren't installed into your app:

${uninstalledHooks.map((hook) => `- ${s.hook(hook.id || 'unknown event')}`).join('\n')}

Run ${s.task('dotcom-tool-kit --install')} to install these hooks.
`

type Missing = { hook: HookTask; tasks: string[] }

const formatMissingTask = (missing: Missing): string =>
  `- ${missing.tasks.map(s.task).join(', ')} ${s.dim(
    `(assigned to ${s.hook(missing.hook.id)} by ${formatPlugin(missing.hook.plugin)})`
  )}`

export const formatMissingTasks = (
  missingTasks: Missing[],
  tasks: string[]
): string => `These tasks don't exist, but are configured to run from hooks:

${missingTasks.map(formatMissingTask).join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't used by this app.

Available tasks are: ${tasks.map(s.task).join(', ')}.
`
