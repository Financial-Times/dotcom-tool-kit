import { loadConfig } from './config'
import { OptionKey, setOptions } from '@dotcom-tool-kit/options'
import { styles as s } from '@dotcom-tool-kit/logger'
import type { Logger } from 'winston'
import YAML from 'yaml'
import $t from 'endent'
import { CommandTask, OptionsForTask } from '@dotcom-tool-kit/plugin'
import { ValidConfig } from '@dotcom-tool-kit/config'

const toolKitIntro = s.box(
  $t`
    Tool Kit is modern, maintainable & modular developer tooling for FT.com projects.
    ${s.URL('https://github.com/financial-times/dotcom-tool-kit')}
  `,
  { headerText: `🧰 ${s.title(`welcome to ${s.app('Tool Kit')}!`)}` }
)

const formatTask = ({ task, options }: OptionsForTask) => $t`
  ${s.task(task)}${
  Object.keys(options).length > 0
    ? ` ${s.dim('with options:')}
    ${YAML.stringify(options).trim()}`
    : ''
}
`

const formatCommandTasks = (config: ValidConfig, commands: string[]) =>
  s.box(
    $t`
  ${s.info(
    `commands run Tool Kit tasks with ${s.code(
      'npx dotcom-tool-kit $command'
    )}, or via configuration installed by hooks in your repository.`
  )}
  ${commands
    .map((command) =>
      config.commandTasks[command] ? formatCommandTask(command, config.commandTasks[command]) + '\n' : ''
    )
    .join('')}
`,
    {
      headerText: s.title('⚙️ available commands')
    }
  )

const formatCommandTask = (command: string, { tasks, plugin }: CommandTask) => $t`
  ${s.groupHeader(s.command(command))}
  ${
    tasks.length
      ? $t`
        ${s.info(`${plugin.id !== 'app root' ? `from plugin ${s.plugin(plugin.id)}. ` : ''}runs tasks:`)}
        ${tasks.map((task) => `  - ${formatTask(task)}`).join('\n')}
      `
      : s.warning(`no tasks configured to run for ${s.command(command)}`)
  }
`

const formatHooks = (config: ValidConfig) =>
  s.box(
    $t`
  ${s.info('hooks manage configuration files in your repository, for running Tool Kit commands.')}
  ${Object.entries(config.hooks)
    .map(([hook, entryPoint]) => {
      const managesFiles = entryPoint.plugin.rcFile?.installs[hook].managesFiles ?? []
      return $t`
        ${s.groupHeader(s.hook(hook))}
        ${s.info($t`
          from plugin ${s.plugin(entryPoint.plugin.id)}
        `)}
        ${managesFiles.length ? 'manages files:' : ''}
        ${managesFiles.map((file) => `  - ${s.filepath(file)}`).join('\n')}
      `
    })
    .join('\n')}
`,
    { headerText: s.title('🎣 installed hooks') }
  )

export default async function showHelp(logger: Logger, commands: string[]): Promise<void> {
  const config = await loadConfig(logger)
  const printAllCommands = commands.length === 0

  if (printAllCommands) {
    commands = Object.keys(config.commandTasks).sort()
  }

  for (const pluginOptions of Object.values(config.pluginOptions)) {
    if (pluginOptions.forPlugin) {
      setOptions(pluginOptions.forPlugin.id as OptionKey, pluginOptions.options)
    }
  }

  logger.info(toolKitIntro)

  const missingCommands = commands.filter((command) => !config.commandTasks[command])

  if (printAllCommands && Object.keys(config.hooks).length) {
    logger.info(formatHooks(config))
  }

  if (missingCommands.length) {
    logger.warn(
      s.warning($t`
      no such ${missingCommands.length > 1 ? 'commands' : 'command'} ${missingCommands
        .map(s.command)
        .join(', ')}
    `)
    )
  }

  logger.info($t`
    ${
      Object.keys(config.commandTasks).length === 0
        ? s.warning($t`
          there are no commands available. add some commands by defining them in your ${s.filepath(
            '.toolkitrc.yml'
          )} or installing plugins that define commands.
        `)
        : formatCommandTasks(config, commands)
    }
  `)
}
