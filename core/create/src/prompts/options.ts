import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/types'
import type { PromptGenerators } from '@dotcom-tool-kit/types/src/schema'
import type { ValidConfig } from 'dotcom-tool-kit/lib/config'
import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import partition from 'lodash/partition'
import prompt from 'prompts'
import { z } from 'zod'
import type { Logger } from '../logger'

interface OptionSettings {
  name: string
  type: z.ZodTypeAny
  default?: any
}

async function optionsPromptForPlugin(
  toolKitConfig: RCFile,
  plugin: string,
  options: OptionSettings[]
): Promise<boolean> {
  let pluginCancelled = false
  const onCancel = () => {
    pluginCancelled = true
  }

  for (const { name: optionName, type: optionType, default: optionDefault } of options) {
    const defaultSuffix = optionDefault
      ? ` (leave blank to use default value ${styles.code(JSON.stringify(optionDefault))})`
      : ''

    const typeSwitch = async (optionType: z.ZodTypeAny) => {
      // the Def type returned by ._def is different for each different Zod
      // schema, but all of the schemas we're checking for here will have a
      // .typeName field on their Def that gives a string representation of
      // their type. this is preferred to using instanceof to check for the
      // type as this method should work when different versions of zod are
      // installed.
      const typeName = optionType._def.typeName as z.ZodFirstPartyTypeKind
      switch (typeName) {
        case 'ZodString':
          const { stringOption } = await prompt(
            {
              name: 'stringOption',
              type: 'text',
              message: `Set a value for '${styles.option(optionName)}'` + defaultSuffix
            },
            { onCancel }
          )
          if (stringOption !== '') {
            toolKitConfig.options[plugin][optionName] = stringOption
          }
          break
        case 'ZodBoolean':
          const { boolOption } = await prompt(
            {
              name: 'boolOption',
              type: 'confirm',
              message: `Would you like to enable option '${styles.option(optionName)}'?` + defaultSuffix
            },
            { onCancel }
          )
          if (boolOption !== '') {
            toolKitConfig.options[plugin][optionName] = boolOption
          }
          break
        case 'ZodNumber':
          const { numberOption } = await prompt(
            {
              name: 'numberOption',
              type: 'text',
              message: `Set a numerical value for '${styles.option(optionName)}'` + defaultSuffix
            },
            { onCancel }
          )
          if (numberOption !== '') {
            toolKitConfig.options[plugin][optionName] = Number.parseFloat(numberOption)
          }
          break
        case 'ZodArray':
          const elementType = (optionType as z.ZodArray<z.ZodTypeAny>).element
          switch (elementType._def.typeName as z.ZodFirstPartyTypeKind) {
            case 'ZodString':
              const { stringArrayOption }: { stringArrayOption: string | undefined } = await prompt(
                {
                  name: 'stringArrayOption',
                  type: 'text',
                  message:
                    `Set a list of values for '${styles.option(optionName)}' (delimited by commas)` +
                    defaultSuffix
                },
                { onCancel }
              )
              if (stringArrayOption !== '' && stringArrayOption !== undefined) {
                toolKitConfig.options[plugin][optionName] = stringArrayOption.split(',').map((s) => s.trim())
              }
              break
            case 'ZodNumber':
              const { numberArrayOption }: { numberArrayOption: string | undefined } = await prompt(
                {
                  name: 'numberArrayOption',
                  type: 'text',
                  message:
                    `Set a list of values for '${styles.option(optionName)}' (delimited by commas)` +
                    defaultSuffix
                },
                { onCancel }
              )
              if (numberArrayOption !== '' && numberArrayOption !== undefined) {
                toolKitConfig.options[plugin][optionName] = numberArrayOption
                  .split(',')
                  .map((s) => Number.parseFloat(s.trim()))
              }
              break
            case 'ZodEnum':
              const { option } = await prompt(
                {
                  name: 'option',
                  type: 'multiselect',
                  choices: (elementType as z.ZodEnum<any>).options.map((choice: string) => ({
                    title: choice,
                    value: choice
                  })),
                  message: `Select options for '${styles.option(optionName)}'` + defaultSuffix
                },
                { onCancel }
              )
              if (option !== '') {
                toolKitConfig.options[plugin][optionName] = option
              }
              break
          }
          break
        case 'ZodEnum':
          const { option } = await prompt(
            {
              name: 'option',
              type: 'select',
              choices: (optionType as z.ZodEnum<any>).options.map((choice: string) => ({
                title: choice,
                value: choice
              })),
              message: `Select an option for '${styles.option(optionName)}'` + defaultSuffix
            },
            { onCancel }
          )
          if (option !== '') {
            toolKitConfig.options[plugin][optionName] = option
          }
          break
        case 'ZodUnion':
          // only suggest the first choice of a union
          await typeSwitch((optionType as z.ZodUnion<z.ZodUnionOptions>).options[0])
          break
        default:
          winstonLogger.verbose(
            `skipping prompting for unrecognised option type ${typeName} for ${optionName}`
          )
          break
      }
    }

    await typeSwitch(optionType)

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

type ZodPartial = z.ZodOptional<z.ZodTypeAny> | z.ZodDefault<z.ZodTypeAny>

const isPartialOptional = (partial: ZodPartial): partial is z.ZodOptional<z.ZodTypeAny> =>
  typeof (partial as z.ZodOptional<z.ZodTypeAny>).unwrap === 'function'

export default async ({ logger, config, toolKitConfig, configPath }: OptionsParams): Promise<boolean> => {
  for (const plugin of Object.keys(config.plugins)) {
    let options: z.AnyZodObject
    let generators: PromptGenerators<z.AnyZodObject> | undefined
    const pluginName = plugin.slice(17)

    try {
      // TODO allow different schemas for tasks within a plugin
      const { Schema, generators: SchemaGenerators } =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`@dotcom-tool-kit/types/lib/schema/${pluginName}`)
      options = Schema
      generators = SchemaGenerators
    } catch (err) {
      // An error here should mean that a schema doesn't exist, i.e., there are
      // no options available for the plugin.
      continue
    }

    const [partial, required] = partition<[string, z.ZodTypeAny], [string, ZodPartial]>(
      Object.entries(options.shape),
      (schema): schema is [string, ZodPartial] => schema[1].isOptional()
    )
    const anyRequired = required.length > 0

    const styledPlugin = styles.plugin(pluginName)
    toolKitConfig.options[plugin] = {}

    if (anyRequired) {
      winstonLogger.info(`Please now configure the options for the ${styledPlugin} plugin.`)
      let cancelled = await optionsPromptForPlugin(
        toolKitConfig,
        plugin,
        required.map(([name, type]) => ({ name, type }))
      )
      const onCancel = () => {
        cancelled = true
      }
      if (!cancelled && generators) {
        for (const [optionName, generator] of Object.entries(generators)) {
          toolKitConfig.options[plugin][optionName] = await generator!(
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

    if (partial.length > 0) {
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
          partial.map(([name, partialType]) => {
            if (isPartialOptional(partialType)) {
              return { name, type: partialType.unwrap() }
            } else {
              return { name, type: partialType.removeDefault(), default: partialType._def.defaultValue() }
            }
          })
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
