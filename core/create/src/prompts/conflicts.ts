import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/types'
import type { cosmiconfig } from 'cosmiconfig'
import type { ValidConfig } from 'dotcom-tool-kit/lib/config'
import type installHooksType from 'dotcom-tool-kit/lib/install'
import { promises as fs } from 'fs'
import importCwd from 'import-cwd'
import * as yaml from 'js-yaml'
import ordinal from 'ordinal'
import prompt from 'prompts'
import { Logger, runTasksWithLogger } from '../logger'

interface ConflictsParams {
  error: ToolkitErrorModule.ToolKitConflictError
  logger: Logger
  toolKitConfig: RCFile
  configPath: string
}

function clearConfigCache() {
  // we need to import explorer from the app itself instead of npx as this is
  // the object used by installHooks()
  return (importCwd('dotcom-tool-kit/lib/rc-file') as {
    explorer: ReturnType<typeof cosmiconfig>
  }).explorer.clearSearchCache()
}

export function installHooks(logger: typeof winstonLogger): Promise<ValidConfig> {
  // we need to import installHooks from the app itself instead of npx or else
  // loadPlugin will load rawPlugin from npx and Task will be loaded from the
  // app, leading to task.prototype failing the instanceof Task check
  return (importCwd('dotcom-tool-kit/lib/install') as {
    default: typeof installHooksType
  }).default(logger)
}

export default async ({
  error,
  logger,
  toolKitConfig,
  configPath
}: ConflictsParams): Promise<ValidConfig | undefined> => {
  const orderedHooks: { [hook: string]: string[] } = {}

  for (const conflict of error.conflicts) {
    const remainingTasks = conflict.conflictingTasks
    orderedHooks[conflict.hook] = []

    const totalTasks = remainingTasks.length
    for (let i = 1; i <= totalTasks; i++) {
      const { order: nextIdx }: { order: number | undefined | null } = await prompt({
        name: 'order',
        type: 'select',
        message: `Hook ${styles.hook(conflict.hook)} has multiple tasks configured for it. \
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
        return
      } else if (nextIdx === null) {
        break
      } else {
        const { task } = remainingTasks.splice(nextIdx, 1)[0]
        orderedHooks[conflict.hook].push(task)
      }
    }
  }

  toolKitConfig.hooks = orderedHooks
  const configFile = yaml.dump(toolKitConfig)

  const { confirm } = await prompt({
    name: 'confirm',
    type: 'confirm',
    message: `ok, we're gonna recreate the ${styles.filepath('.toolkitrc.yml')} containing:

${configFile}
sound alright?`
  })

  if (confirm) {
    const configPromise = logger.logPromise(
      fs.writeFile(configPath, configFile).then(() => winstonLogger),
      `recreating ${styles.filepath('.toolkitrc.yml')}`
    )
    // Clear config cache now that config has been updated
    clearConfigCache()

    return runTasksWithLogger(logger, configPromise, installHooks, 'installing Tool Kit hooks again', false)
  }
}