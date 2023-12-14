import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/types'
import type { ValidConfig } from 'dotcom-tool-kit/lib/config'
import type installHooksType from 'dotcom-tool-kit/lib/install'
import { promises as fs } from 'fs'
import importCwd from 'import-cwd'
import type Logger from 'komatsu'
import ordinal from 'ordinal'
import prompt from 'prompts'
import YAML from 'yaml'

interface ConflictsParams {
  error: ToolkitErrorModule.ToolKitConflictError
  logger: Logger
  toolKitConfig: RCFile
  configPath: string
}

export function installHooks(logger: typeof winstonLogger): Promise<ValidConfig> {
  // we need to import installHooks from the app itself instead of npx or else
  // loadPlugin will load rawPlugin from npx and Task will be loaded from the
  // app, leading to task.prototype failing the instanceof Task check
  return (importCwd('dotcom-tool-kit/lib/install') as {
    default: typeof installHooksType
  }).default(logger)
}

export default async ({ error, logger, toolKitConfig, configPath }: ConflictsParams): Promise<boolean> => {
  const orderedHooks: { [hook: string]: string[] } = {}

  for (const conflict of error.conflicts) {
    const remainingTasks = conflict.conflictingTasks
    orderedHooks[conflict.hook] = []

    const totalTasks = remainingTasks.length
    for (let i = 1; i <= totalTasks; i++) {
      const { order: nextIdx }: { order: number | undefined | null } = await prompt({
        name: 'order',
        type: 'select',
        message: `Hook ${styles.hook(
          conflict.hook
        )} has multiple tasks configured for it, so an order must be specified. \
Please select the ${ordinal(i)} package to run.`,
        choices: [
          ...remainingTasks.map(({ task, plugin }) => ({
            title: styles.task(task),
            description: `defined by ${styles.plugin(plugin)}`
          })),
          { title: 'finish', value: null, description: "don't include any more tasks in the hook" }
        ]
      })

      if (nextIdx === undefined) {
        return true
      } else if (nextIdx === null) {
        break
      } else {
        const { task } = remainingTasks.splice(nextIdx, 1)[0]
        orderedHooks[conflict.hook].push(task)
      }
    }
  }

  toolKitConfig.hooks = orderedHooks
  const configFile = YAML.stringify(toolKitConfig)

  const { confirm } = await prompt({
    name: 'confirm',
    type: 'confirm',
    initial: true,
    message: `ok, we're gonna recreate the ${styles.filepath('.toolkitrc.yml')} containing:

${configFile}
sound alright?`
  })

  if (confirm) {
    await logger.logPromise(
      fs.writeFile(configPath, configFile),
      `recreating ${styles.filepath('.toolkitrc.yml')}`
    )
    return false
  }
  return true
}
