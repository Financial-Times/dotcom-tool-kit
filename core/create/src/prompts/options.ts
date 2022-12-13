import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/types'
import type { Schema, SchemaPromptGenerator, SchemaType } from '@dotcom-tool-kit/types/src/schema'
import type { ValidConfig } from 'dotcom-tool-kit/lib/config'
import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import partition from 'lodash/partition'
import prompt from 'prompts'
import type { Logger } from '../logger'

async function optionsPromptForPlugin(
  toolKitConfig: RCFile,
  plugin: string,
  options: [string, SchemaType][]
): Promise<boolean> {
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

export interface OptionsParams {
  logger: Logger
  config: ValidConfig
  toolKitConfig: RCFile
  configPath: string
}

export default async ({ logger, config, toolKitConfig, configPath }: OptionsParams): Promise<boolean> => {
  for (const plugin of Object.keys(config.plugins)) {
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
      let cancelled = await optionsPromptForPlugin(toolKitConfig, plugin, schemas)
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
          toolKitConfig,
          plugin,
          optional.map(([name, optionType]) => [name, optionType.slice(0, -1) as SchemaType])
        )
      } else if (!anyRequired) {
        delete toolKitConfig.options[plugin]
      }
    }
  }

  if (Object.keys(toolKitConfig.options).length > 0) {
    const configFile = yaml.dump(toolKitConfig)

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
