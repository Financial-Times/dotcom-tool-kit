import colours from 'ansi-colors'

import type { PluginOptions } from './config'
import type { Conflict } from './conflict'
import type { LifecycleAssignment, LifecycleClass } from './lifecycle'
import type { CommandClass } from './command'

// consistent styling use cases for terminal colours
// don't use ansi-colors directly, define a style please
const s = {
  lifecycle: colours.magenta,
  command: colours.blueBright,
  plugin: colours.cyan,
  URL: colours.cyan.underline,
  app: colours.green,
  heading: colours.bold,
  dim: colours.grey
}

const formatCommandConflict = (conflict: Conflict<CommandClass>): string =>
  `- ${s.command(conflict.conflicting[0].id || 'unknown command')} ${s.dim(
    'from plugins'
  )} ${conflict.conflicting
    .map((command) => s.plugin(command.plugin ? command.plugin.id : 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatCommandConflicts = (conflicts: Conflict<CommandClass>[]): string => `${s.heading(
  'There are multiple plugins that include the same commands'
)}:
${conflicts.map(formatCommandConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatLifecycleConflict = (conflict: Conflict<LifecycleClass>): string =>
  `- ${s.lifecycle(conflict.conflicting[0].id || 'unknown event')} ${s.dim(
    'from plugins'
  )} ${conflict.conflicting
    .map((command) => s.plugin(command.plugin ? command.plugin.id : 'unknown plugin'))
    .join(s.dim(', '))}`

export const formatLifecycleConflicts = (conflicts: Conflict<LifecycleClass>[]): string => `${s.heading(
  'There are multiple plugins that include the same lifecycle events'
)}:
${conflicts.map(formatLifecycleConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatLifecycleAssignmentConflict = (conflict: Conflict<LifecycleAssignment>): string => `${s.lifecycle(
  conflict.conflicting[0].id
)}:
${conflict.conflicting
  .map(
    (lifecycle) =>
      `- ${lifecycle.commands.map(s.command).join(s.dim(', '))} ${s.dim('by plugin')} ${s.plugin(
        lifecycle.plugin.id
      )}`
  )
  .join('\n')}
`

export const formatLifecycleAssignmentConflicts = (
  conflicts: Conflict<LifecycleAssignment>[]
): string => `${s.heading('These lifecycle events are assigned to different commands by multiple plugins')}:
${conflicts.map(formatLifecycleAssignmentConflict).join('\n')}
You must resolve this conflict by explicitly configuring which command to use for these events. See ${s.URL(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/docs/resolving-lifecycle-conflicts.md'
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

// TODO text similarity "did you mean...?"
export const formatUndefinedLifecycleAssignments = (
  undefinedAssignments: LifecycleAssignment[],
  definedLifecycles: string[]
): string => `These lifecycle events don't exist, but have commands assigned to them:

${undefinedAssignments
  .map(
    (lifecycle) =>
      `- ${s.lifecycle(lifecycle.id)} assigned by ${
        lifecycle.plugin.id === 'app root' ? s.app('your app') : `plugin ${s.plugin(lifecycle.plugin.id)}`
      }`
  )
  .join('\n')}

They could be misspelt, or defined by a Tool Kit plugin that isn't used by this app.

Available lifecycle events are: ${definedLifecycles.map(s.command).join(', ')}.
`

export const formatUninstalledLifecycles = (
  uninstalledLifecycles: LifecycleClass[]
): string => `These lifecycle events aren't installed into your app:

${uninstalledLifecycles.map((lifecycle) => `- ${s.lifecycle(lifecycle.id || 'unknown event')}`).join('\n')}

Run ${s.command('dotcom-tool-kit install')} to install these events.
`
