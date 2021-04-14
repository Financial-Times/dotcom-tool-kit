import c from 'ansi-colors'

import type { Conflict } from './conflict'
import type { Lifecycle } from './lifecycle'
import type { CommandClass } from './command'

const formatCommandConflict = (conflict: Conflict<CommandClass>) => `- ${c.blueBright(conflict.conflicting[0].id || 'unknown command')} ${c.grey('from plugins')} ${conflict.conflicting.map(command => c.cyan(command.plugin ? command.plugin.id : 'unknown plugin')).join(c.grey(', '))}`

export const formatCommandConflicts = (conflicts: Conflict<CommandClass>[]) => `${c.bold('There are multiple plugins that include the same commands')}:
${conflicts.map(formatCommandConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatLifecycleConflict = (conflict: Conflict<Lifecycle>) => `${c.magenta(conflict.conflicting[0].id)}:
${conflict.conflicting.map(lifecycle => `- ${lifecycle.commands.map(c.blueBright).join(c.grey(', '))} ${c.grey('by plugin')} ${c.cyan(lifecycle.plugin.id)}`).join('\n')}
`

export const formatLifecycleConflicts = (conflicts: Conflict<Lifecycle>[]) => `${c.bold('These lifecycle events are assigned to different commands by multiple plugins')}:
${conflicts.map(formatLifecycleConflict).join('\n')}
You must resolve this conflict by explicitly configuring which command to use for these events. See ${c.cyan.underline('https://github.com/financial-times/dotcom-tool-kit/wiki/Resolving-Lifecycle-Conflicts')} for more details.

`
