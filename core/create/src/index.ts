import * as ToolkitErrorModule from '@dotcom-tool-kit/error'
import type { RCFile } from '@dotcom-tool-kit/types'
import type { Schema, SchemaPromptGenerator, SchemaType } from '@dotcom-tool-kit/types/src/schema'
import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import loadPackageJson from '@financial-times/package-json'
import parseMakefileRules from '@quarterto/parse-makefile-rules'
import { exec as _exec } from 'child_process'
import { ValidConfig } from 'dotcom-tool-kit/lib/config'
import { explorer } from 'dotcom-tool-kit/lib/rc-file'
import type { RawConfig } from 'dotcom-tool-kit/src/config'
import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import partition from 'lodash.partition'
import ordinal from 'ordinal'
import pacote from 'pacote'
import path from 'path'
import prompt from 'prompts'
import { promisify } from 'util'
import { Logger, labels, LoggerError } from './logger'
import installHooksType from 'dotcom-tool-kit/lib/install'
import importCwd from 'import-cwd'

const exec = promisify(_exec)

const packagesToInstall = ['dotcom-tool-kit']
const packagesToRemove: string[] = []
const toolKitConfig: RCFile = {
  plugins: [],
  hooks: {},
  options: {}
}

const packageJson = loadPackageJson({ filepath: path.resolve(process.cwd(), 'package.json') })
let configFile = ''
const configPath = path.join(process.cwd(), '.toolkitrc.yml')
const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')

const logger = new Logger()

function installHooks(logger: typeof winstonLogger) {
  // we need to import installHooks from the app itself instead of npx or else loadPlugin will load rawPlugin from npx and Task will be loaded from the app, leading to task.prototype failing the instanceof Task check
  return (importCwd('dotcom-tool-kit/lib/install') as {
    default: typeof installHooksType
  }).default(logger)
}

function hasToolKitConflicts(error: unknown) {
  // we need to import hasToolkitConflicts from the app itself instead of npx or else hasToolkitConflicts and ToolKitConflictError will come from npx but error will come from the app level, leading to error failing the instanceof ToolKitConflictError check
  return (importCwd('@dotcom-tool-kit/error') as typeof ToolkitErrorModule).hasToolKitConflicts(error)
}

async function runTasksWithLogger<T, U>(wait: Promise<T>, run: (interim: T) => Promise<U>, label: string) {
  const labels: labels = {
    waiting: `not ${label} yet`,
    pending: label,
    done: `finished ${label}`,
    fail: `error with ${label}`
  }

  const { interim, id } = await logger.logPromiseWait(wait, labels)

  try {
    logger.log(id, { message: labels.pending })

    const result = await run(interim)
    logger.log(id, { status: 'done', message: labels.done })
    return result
  } catch (error) {
    const loggerError = error as LoggerError
    // hack to suppress error when installHooks promise fails seeing as it's
    // recoverable
    if (hasToolKitConflicts(error)) {
      logger.log(id, { status: 'done', message: 'finished installing hooks, but found conflicts' })
    } else {
      logger.log(id, {
        status: 'fail',
        message: labels.fail,
        error: loggerError.logged ? undefined : loggerError
      })
    }

    loggerError.logged = true
    throw loggerError
  }
}

async function mainPrompt() {
  return prompt(
    [
      {
        name: 'preset',
        type: 'select',
        message: `What kind of app is ${styles.app(packageJson.getField('name'))}?`,
        choices: [
          { title: 'A user-facing (frontend) app', value: 'frontend-app' },
          { title: 'A service (backend) app', value: 'backend-app' }
        ]
      },
      {
        name: 'additional',
        type: 'multiselect',
        message: 'Would you like to install any additional plugins?',
        choices: [
          {
            title: 'Jest',
            value: 'jest',
            description: 'a delightful JavaScript Testing Framework with a focus on simplicity'
          },
          {
            title: 'Mocha',
            value: 'mocha',
            description:
              'a feature-rich JavaScript test framework, making asynchronous testing simple and fun'
          },
          { title: 'ESLint', value: 'eslint', description: 'an open source JavaScript linting utility' },
          { title: 'Prettier', value: 'prettier', description: 'an opinionated code formatter' },
          { title: 'lint-staged', value: 'lint-staged', description: 'run linters on git staged files' }
        ].map((choice) => ({ ...choice, title: styles.plugin(choice.title) }))
      },
      {
        name: 'deleteConfig',
        // Skip prompt if CircleCI config doesn't exist
        type: await fs
          .access(circleConfigPath)
          .then(() => 'confirm' as const)
          .catch(() => null),
        // This .relative() call feels redundant at the moment. Maybe we can just
        // hard-code the config path?
        message: `Would you like a CircleCI config to be generated? This will overwrite the current config at ${styles.filepath(
          path.relative('', circleConfigPath)
        )}.`
      },
      {
        name: 'uninstall',
        type: 'confirm',
        message: `Should we uninstall obsolete ${styles.app('n-gage')} and ${styles.app(
          'n-heroku-tools'
        )} packages?`
      }
    ],
    {
      onCancel: () => process.exit(1)
    }
  )
}

function confirmationPrompt() {
  return prompt({
    name: 'confirm',
    type: 'confirm',
    message: (_prev, values) => {
      configFile = yaml.dump(toolKitConfig)
      return `so, we're gonna:

install the following packages:
${packagesToInstall.map((p) => `- ${styles.plugin(p)}`).join('\n')}\

${
  packagesToRemove.length > 0
    ? '\nuninstall the following packages:\n' +
      packagesToRemove.map((p) => `- ${styles.plugin(p)}`).join('\n') +
      '\n'
    : ''
}
create a ${styles.filepath('.toolkitrc.yml')} containing:
${configFile}\
${values.deleteConfig ? '\nregenerate styles.filepath(".circleci/config.yml")\n' : ''}
sound good?`
    }
  })
}

async function executeMigration(deleteConfig: boolean): Promise<RawConfig> {
  for (const pkg of packagesToInstall) {
    const { version } = await pacote.manifest(pkg)
    packageJson.requireDependency({
      pkg,
      version: `^${version}`,
      field: 'devDependencies'
    })
  }
  for (const pkg of packagesToRemove) {
    packageJson.removeDependency({
      pkg,
      field: 'devDependencies'
    })
  }

  packageJson.writeChanges()

  await logger.logPromise(exec('npm install'), 'installing dependencies')
  const configPromise = logger.logPromise(
    fs.writeFile(configPath, configFile),
    `creating ${styles.filepath('.toolkitrc.yml')}`
  )

  const unlinkPromise = deleteConfig
    ? logger.logPromise(fs.unlink(circleConfigPath), 'removing old CircleCI config')
    : Promise.resolve()

  const initialTasks = Promise.all([configPromise, unlinkPromise]).then(() => winstonLogger)

  return runTasksWithLogger(initialTasks, installHooks, 'installing Tool Kit hooks')
}

async function handleTaskConflict(
  error: ToolkitErrorModule.ToolKitConflictError
): Promise<RawConfig | undefined> {
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
  configFile = yaml.dump(toolKitConfig)

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
    explorer.clearSearchCache()

    return runTasksWithLogger(configPromise, installHooks, 'installing Tool Kit hooks again')
  }
}

async function optionsPromptForPlugin(plugin: string, options: [string, SchemaType][]): Promise<boolean> {
  let pluginCancelled = false
  const onCancel = () => {
    pluginCancelled = true
  }

  for (const [optionName, optionType] of options) {
    switch (optionType) {
      case 'string':
        const { stringOption } = await prompt(
          {
            name: 'stringOption',
            type: 'text',
            message: `Set a value for '${styles.option(optionName)}'`
          },
          { onCancel }
        )
        if (stringOption !== '') {
          toolKitConfig.options[plugin][optionName] = stringOption
        }
        break
      case 'boolean':
        const { boolOption } = await prompt(
          {
            name: 'boolOption',
            type: 'confirm',
            message: `Would you like to enable option '${styles.option(optionName)}'?`
          },
          { onCancel }
        )
        if (boolOption !== '') {
          toolKitConfig.options[plugin][optionName] = boolOption
        }
        break
      case 'number':
        const { numberOption } = await prompt(
          {
            name: 'numberOption',
            type: 'text',
            message: `Set a numerical value for '${styles.option(optionName)}'`
          },
          { onCancel }
        )
        if (numberOption !== '') {
          toolKitConfig.options[plugin][optionName] = Number.parseFloat(numberOption)
        }
        break
      case 'array.string':
        const { stringArrayOption }: { stringArrayOption: string | undefined } = await prompt(
          {
            name: 'stringArrayOption',
            type: 'text',
            message: `Set a list of values for '${styles.option(optionName)}' (delimited by commas)`
          },
          { onCancel }
        )
        if (stringArrayOption !== '' && stringArrayOption !== undefined) {
          toolKitConfig.options[plugin][optionName] = stringArrayOption.split(',').map((s) => s.trim())
        }
        break
      case 'array.number':
        const { numberArrayOption }: { numberArrayOption: string | undefined } = await prompt(
          {
            name: 'numberArrayOption',
            type: 'text',
            message: `Set a list of values for '${styles.option(optionName)}' (delimited by commas)`
          },
          { onCancel }
        )
        if (numberArrayOption !== '' && numberArrayOption !== undefined) {
          toolKitConfig.options[plugin][optionName] = numberArrayOption
            .split(',')
            .map((s) => Number.parseFloat(s.trim()))
        }
        break
      default:
        if (optionType.startsWith('|')) {
          const { option } = await prompt(
            {
              name: 'option',
              type: 'select',
              choices: optionType
                .slice(1)
                .split(',')
                .map((choice) => ({ title: choice, value: choice })),
              message: `Select an option for '${styles.option(optionName)}'`
            },
            { onCancel }
          )
          if (option !== '') {
            toolKitConfig.options[plugin][optionName] = option
          }
        } else if (optionType.startsWith('array.|')) {
          const { option } = await prompt(
            {
              name: 'option',
              type: 'multiselect',
              choices: optionType
                .slice(7)
                .split(',')
                .map((choice) => ({ title: choice, value: choice })),
              message: `Select options for '${styles.option(optionName)}'`
            },
            { onCancel }
          )
          if (option !== '') {
            toolKitConfig.options[plugin][optionName] = option
          }
        }
    }

    if (pluginCancelled) {
      return true
    }
  }

  return false
}

async function optionsPrompt(config: RawConfig): Promise<boolean> {
  for (const plugin of Object.keys((config as ValidConfig).plugins)) {
    let options: Schema
    const pluginName = plugin.slice(17)

    try {
      // TODO allow different schemas for tasks within a plugin
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      options = require(`@dotcom-tool-kit/types/lib/schema/${pluginName}`).Schema
    } catch (err) {
      // An error here should mean that a schema doesn't exist, i.e., there are
      // no options available for the plugin.
      continue
    }

    const [optional, required] = partition(
      Object.entries(options),
      (schema): schema is [string, `${SchemaType}?`] =>
        typeof schema[1] === 'string' && schema[1].endsWith('?')
    )
    const anyRequired = required.length > 0

    const styledPlugin = styles.plugin(pluginName)
    toolKitConfig.options[plugin] = {}

    if (anyRequired) {
      winstonLogger.info(`Please now configure the options for the ${styledPlugin} plugin.`)
      const [schemas, generators] = partition(
        required,
        (schema): schema is [string, SchemaType] => typeof schema[1] === 'string'
      )
      let cancelled = await optionsPromptForPlugin(plugin, schemas)
      const onCancel = () => {
        cancelled = true
      }
      if (!cancelled) {
        for (const [optionName, generator] of generators as [string, SchemaPromptGenerator<unknown>][]) {
          toolKitConfig.options[plugin][optionName] = await generator(
            winstonLogger.child({ plugin }),
            prompt,
            onCancel
          )
          if (cancelled) {
            break
          }
        }
      }
      if (cancelled) {
        delete toolKitConfig.options[plugin]
        return true
      }
    }

    if (optional.length > 0) {
      const { confirm } = await prompt({
        name: 'confirm',
        type: 'confirm',
        message: `${
          anyRequired ? 'Some' : 'All'
        } of the fields for the ${styledPlugin} plugin are optional. Would you like to configure ${
          anyRequired ? 'those too' : 'them'
        }?`
      })

      if (confirm) {
        await optionsPromptForPlugin(
          plugin,
          optional.map(([name, optionType]) => [name, optionType.slice(0, -1) as SchemaType])
        )
      } else if (!anyRequired) {
        delete toolKitConfig.options[plugin]
      }
    }
  }

  if (Object.keys(toolKitConfig.options).length > 0) {
    configFile = yaml.dump(toolKitConfig)

    const { confirm } = await prompt({
      name: 'confirm',
      type: 'confirm',
      message: `right, let's set the options you've given in the ${styles.filepath('.toolkitrc.yml')} like so:

${configFile}
sound reasonable?`
    })

    if (confirm) {
      await logger.logPromise(
        fs.writeFile(configPath, configFile),
        `writing options to ${styles.filepath('.toolkitrc.yml')}`
      )
    }

    return !confirm
  } else {
    return false
  }
}

async function makefileHint() {
  // Handle case-sensitive file systems
  let makefile
  try {
    makefile = await fs.readFile(path.join(process.cwd(), 'makefile'), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
  try {
    makefile = await fs.readFile(path.join(process.cwd(), 'Makefile'), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
  if (makefile) {
    const rules = parseMakefileRules(makefile)
    const targets = Object.keys(rules)
    winstonLogger.info(`${styles.ruler()}\n`)
    winstonLogger.info(
      "We recommend deleting your old Makefile as it will no longer be used. In the \
future you can run tasks with 'npm run' instead. Make sure that you won't be \
deleting any task logic that hasn't already been migrated to Tool Kit. If you \
find anything that can't be handled by Tool Kit then please let the Platforms \
team know."
    )

    const equivalentHooks: Record<string, string> = {
      'unit-test': 'test:*',
      test: 'test:local',
      build: 'build:local'
    }

    const mappedSuggestions = targets
      .filter((target) => target !== 'node_modules/@financial-times/n-gage/index.mk')
      .map((target) => [target, equivalentHooks[target]])
    // split the targets into ones we have suggestions for and ones we don't
    const [suggested, unrecognised] = partition(mappedSuggestions, 1)
    const suggestionsFound = suggested.length > 0

    if (suggestionsFound) {
      winstonLogger.info("\nWe've found some targets in your Makefile which could be migrated to Tool Kit:")
      for (const [target, suggestion] of suggested) {
        if (suggestion) {
          winstonLogger.info(
            `- Your ${styles.makeTarget(target)} target is likely handled by the ${styles.hook(
              suggestion
            )} hook in Tool Kit`
          )
        }
      }
    }

    if (unrecognised.length > 0) {
      winstonLogger.info(
        `\nWe don't know if these${
          suggestionsFound ? ' other' : ''
        } Makefile targets can be migrated to Tool Kit. Please check what they're doing:`
      )
      for (const [target] of unrecognised) {
        winstonLogger.info(`- ${styles.makeTarget(target)}`)
      }
    }
  }
}

async function main() {
  // Start with the initial prompt which will get most of the information we
  // need for the remainder of the execution
  const { preset, additional, deleteConfig, uninstall } = await mainPrompt()

  const selectedPackages = [preset, ...additional].map((plugin) => `@dotcom-tool-kit/${plugin}`)
  packagesToInstall.push(...selectedPackages)
  toolKitConfig.plugins.push(...selectedPackages)

  if (uninstall) {
    packagesToRemove.push('@financial-times/n-gage', '@financial-times/n-heroku-tools')
  }

  // Confirm that the proposed changes are what the user was expecting, giving
  // them a chance to see what we're going to do.
  const { confirm } = await confirmationPrompt()

  if (confirm) {
    let config: RawConfig | undefined
    try {
      // Carry out the proposed changes: install + uninstall packages, run
      // --install logic etc.
      config = await executeMigration(deleteConfig)
    } catch (error) {
      if (hasToolKitConflicts(error)) {
        // Additional questions asked if we have any task conflicts, letting the
        // user to specify the order they want tasks to run in.
        config = await handleTaskConflict(error as ToolkitErrorModule.ToolKitConflictError)
      } else {
        throw error
      }
    }

    // Only run final prompts if execution was successful (this also means these
    // are skipped if the user cancels out of the conflict resolution prompt.)
    if (config) {
      // Give the user a chance to set any configurable options for the plugins
      // they've installed.
      const cancelled = await optionsPrompt(config)
      // Suggest they delete the old n-gage makefile after verifying all its
      // logic has been migrated to Tool Kit.
      if (!cancelled) {
        await makefileHint()
      }
    }
  }
}

main().catch((error) => {
  if (!error.logged) {
    winstonLogger.error(error.stack)
  }
  process.exit(1)
})
