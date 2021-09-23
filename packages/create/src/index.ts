import { ToolKitConflictError } from '@dotcom-tool-kit/error'
import type { Schema, SchemaType } from '@dotcom-tool-kit/types/src/schema'
import loadPackageJson from '@financial-times/package-json'
import parseMakefileRules from '@quarterto/parse-makefile-rules'
import { exec as _exec } from 'child_process'
import { ValidConfig } from 'dotcom-tool-kit/lib/config'
import installHooks from 'dotcom-tool-kit/lib/install'
import { explorer, RCFile } from 'dotcom-tool-kit/lib/rc-file'
import type { Config } from 'dotcom-tool-kit/src/config'
import { promises as fs, readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'
import prompt from 'prompts'
import { promisify } from 'util'
import { Logger } from './logger'
import { styles } from 'dotcom-tool-kit/lib/messages'

const exec = promisify(_exec)

const { version }: { version: string } = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
)

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

async function mainPrompt() {
  return prompt(
    [
      {
        name: 'preset',
        type: 'select',
        message: `What kind of app is ${styles.app(packageJson.getField('name'))}?`,
        choices: [
          { title: 'A user-facing (frontend) app', value: 'frontend-app' },
          { title: 'A service/backend app', value: 'service-app' }
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
          { title: 'ESLint', value: 'eslint', description: 'an open source JavaScript linting utility' }
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

async function executeMigration(deleteConfig: boolean) {
  for (const pkg of packagesToInstall) {
    packageJson.requireDependency({
      pkg,
      version,
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

  const installPromise = logger.logPromise(exec('npm install'), 'installing dependencies')

  const configPromise = logger.logPromise(
    fs.writeFile(configPath, configFile),
    `creating ${styles.filepath('.toolkitrc.yml')}`
  )

  const unlinkPromise = deleteConfig
    ? logger.logPromise(fs.unlink(circleConfigPath), 'removing old CircleCI config')
    : Promise.resolve()

  const initialTasks = Promise.all([installPromise, configPromise, unlinkPromise])

  return logger.logPromiseWait(initialTasks, installHooks, 'installing Tool Kit hooks', true)
}

async function handleTaskConflict(error: ToolKitConflictError) {
  const orderedHooks: { [hook: string]: string[] } = {}

  for (const conflict of error.conflicts) {
    const remainingTasks = conflict.conflictingTasks
    orderedHooks[conflict.hook] = []

    while (remainingTasks.length > 0) {
      const { order: nextIdx }: { order: number | null } = await prompt({
        name: 'order',
        type: 'select',
        message: `Hook ${styles.hook(conflict.hook)} has multiple tasks configured for it. \
Which order do you want them to run in?`,
        choices: [
          ...remainingTasks.map(({ task, plugin }) => ({
            title: styles.task(task),
            description: `defined by ${styles.plugin(plugin)}`
          })),
          { title: 'finish', value: null, description: "don't include any more tasks in the hook" }
        ]
      })

      if (nextIdx !== null) {
        const { task } = remainingTasks.splice(nextIdx, 1)[0]
        orderedHooks[conflict.hook].push(task)
      } else {
        break
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
      fs.writeFile(configPath, configFile),
      `recreating ${styles.filepath('.toolkitrc.yml')}`
    )
    // Clear config cache now that config has been updated
    explorer.clearSearchCache()
    return logger.logPromiseWait(configPromise, installHooks, 'installing Tool Kit hooks again')
  }
}

async function optionsPrompt(config: Config) {
  let optionsCancelled = false
  const onOptionsCancel = () => {
    optionsCancelled = true
  }

  for (const plugin of Object.keys((config as ValidConfig).plugins)) {
    let options: Schema
    const pluginName = plugin.slice(17)

    if (optionsCancelled) {
      break
    }

    try {
      // TODO allow different schemas for tasks within a plugin
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      options = require(`@dotcom-tool-kit/types/lib/schema/${pluginName}`).Schema
    } catch (err) {
      continue
    }
    const { pluginConfirm } = await prompt(
      {
        name: 'pluginConfirm',
        type: 'confirm',
        message: `Do you want to configure the options for the ${styles.plugin(pluginName)} plugin?`
      },
      {
        onCancel: onOptionsCancel
      }
    )
    if (!pluginConfirm) {
      continue
    }
    toolKitConfig.options[plugin] = {}

    let pluginCancelled = false
    const onCancel = () => {
      pluginCancelled = true
    }
    for (const [optionName, modifiedOptionType] of Object.entries(options)) {
      const optionType = (modifiedOptionType.endsWith('?')
        ? modifiedOptionType.slice(0, -1)
        : modifiedOptionType) as SchemaType

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
        delete toolKitConfig.options[plugin]
        break
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
    console.log(
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
    if (targets.some((target) => equivalentHooks[target])) {
      console.log("We've found some targets in your Makefile which could be migrated to Tool Kit:")
      for (const target of targets) {
        const suggestion = equivalentHooks[target]
        if (suggestion) {
          console.log(
            `Your ${target} target is likely handled by the ${styles.hook(suggestion)} hook in Tool Kit`
          )
        }
      }
    }
  }
}

async function main() {
  const { preset, additional, deleteConfig, uninstall } = await mainPrompt()

  const selectedPackages = [preset, ...additional].map((plugin) => `@dotcom-tool-kit/${plugin}`)
  packagesToInstall.push(...selectedPackages)
  toolKitConfig.plugins.push(...selectedPackages)

  if (uninstall) {
    packagesToRemove.push('@financial-times/n-gage', '@financial-times/n-heroku-tools')
  }

  const { confirm } = await confirmationPrompt()

  if (confirm) {
    let config: Config | undefined
    try {
      config = await executeMigration(deleteConfig)
    } catch (error) {
      if (error instanceof ToolKitConflictError && error.conflicts.length > 0) {
        config = await handleTaskConflict(error)
      } else {
        throw error
      }
    }

    if (config) {
      await optionsPrompt(config)
      await makefileHint()
    }
  }
}

main().catch((error) => {
  if (!error.logged) {
    console.log(error.stack)
  }
  process.exit(1)
})
