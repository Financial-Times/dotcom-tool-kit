import c from 'ansi-colors'

import type { PluginOptions } from './config'
import type { Conflict } from './conflict'
import type { LifecycleAssignment } from './lifecycle'
import type { CommandClass } from './command'

const formatCommandConflict = (conflict: Conflict<CommandClass>) =>
  `- ${c.blueBright(conflict.conflicting[0].id || 'unknown command')} ${c.grey(
    'from plugins'
  )} ${conflict.conflicting
    .map((command) => c.cyan(command.plugin ? command.plugin.id : 'unknown plugin'))
    .join(c.grey(', '))}`

export const formatCommandConflicts = (conflicts: Conflict<CommandClass>[]): string => `${c.bold(
  'There are multiple plugins that include the same commands'
)}:
${conflicts.map(formatCommandConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatLifecycleAssignmentConflict = (conflict: Conflict<LifecycleAssignment>) => `${c.magenta(conflict.conflicting[0].id)}:
${conflict.conflicting
  .map(
    (lifecycle) =>
      `- ${lifecycle.commands.map(c.blueBright).join(c.grey(', '))} ${c.grey('by plugin')} ${c.cyan(
        lifecycle.plugin.id
      )}`
  )
  .join('\n')}
`

export const formatLifecycleAssignmentConflicts = (conflicts: Conflict<LifecycleAssignment>[]): string => `${c.bold(
  'These lifecycle events are assigned to different commands by multiple plugins'
)}:
${conflicts.map(formatLifecycleAssignmentConflict).join('\n')}
You must resolve this conflict by explicitly configuring which command to use for these events. See ${c.cyan.underline(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/docs/resolving-lifecycle-conflicts.md'
)} for more details.

`

const formatOptionConflict = (conflict: Conflict<PluginOptions>) => `${c.magenta(
  conflict.conflicting[0].forPlugin.id
)}, configured by:
${conflict.conflicting.map((option) => `- ${c.magenta(option.plugin.id)}`)}`

export const formatOptionConflicts = (conflicts: Conflict<PluginOptions>[]): string => `${c.bold(
  'These plugins have conflicting options'
)}:

${conflicts.map(formatOptionConflict).join('\n')}

You must resolve this conflict by providing options in your app's Tool Kit configuration for these plugins, or installing a use-case plugin that provides these options. See ${c.cyan.underline(
  'https://github.com/financial-times/dotcom-tool-kit/tree/main/readme.md#options'
)} for more details.

`
