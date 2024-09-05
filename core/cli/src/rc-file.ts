import fs from 'node:fs/promises'
import { styles as s } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/plugin'
import * as path from 'path'
import type { Logger } from 'winston'
import * as YAML from 'yaml'

const emptyConfig = {
  plugins: [],
  installs: {},
  tasks: {},
  commands: {},
  options: { plugins: {}, tasks: {}, hooks: [] },
  init: []
} satisfies RCFile

// TODO:IM:20240418 define another type that accounts for the custom tags
// existing deeply within the file
type RawRCFile = {
  [key in Exclude<keyof RCFile, 'options'>]?: RCFile[key] | null
} & {
  options:
    | {
        [key in keyof RCFile['options']]?: RCFile['options'][key] | null
      }
    | null
}

// yaml will automatically stringify any symbols in keys so just use strings
// that won't be used normally
export const toolKitOptionIdent = '__toolkit/option__'
export const toolKitIfDefinedIdent = '__toolkit/if-defined__'

// minimally define the two custom tags' identify callback so that yaml will
// parse them without warning but will never be use them when stringifying
const toolKitOption = {
  identify: () => false,
  tag: '!toolkit/option',
  // wrap option path with identifier so we can substitute the option's value
  // once it's been resolved later
  resolve: (option) => `${toolKitOptionIdent}${option}`
} satisfies YAML.ScalarTag
const toolKitIfDefined = {
  identify: () => false,
  tag: '!toolkit/if-defined',
  // the resolve callback doesn't allow us to manipulate the whole YAML.Pair
  // with this tagged key, so just return it unchanged now and find the tag in
  // a YAML.visit later
  resolve: (value) => value
} satisfies YAML.ScalarTag

export async function loadToolKitRC(logger: Logger, root: string): Promise<RCFile> {
  let rawConfig: string
  try {
    rawConfig = await fs.readFile(path.join(root, '.toolkitrc.yml'), 'utf8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return emptyConfig
    } else {
      throw err
    }
  }

  const configDoc = YAML.parseDocument(rawConfig, { customTags: [toolKitOption, toolKitIfDefined] })
  // go back and search for the parsed if-defined tag and include a string
  // identifier so we can resolve all the tags in a JS object once we've loaded
  // plugin options
  YAML.visit(configDoc, {
    Pair(_, pair) {
      if (YAML.isScalar(pair.key) && pair.key.tag === '!toolkit/if-defined') {
        // mangle the option name with the identifier so that multiple
        // !toolkit/if-defined tags can be used in the same map with unique keys
        return configDoc.createPair(`${toolKitIfDefinedIdent}${pair.key.value}`, pair.value)
      }
    }
  })
  const config: RawRCFile = configDoc.toJS() ?? {}

  // if a toolkitrc contains a non-empty options field, but not options.{plugins,tasks,hooks},
  // assume it's an old-style, plugins-only options field.
  // TODO:KB:20240410 remove this legacy options field handling in a future major version
  if (
    config.options &&
    Object.keys(config.options).length > 0 &&
    !(config.options.plugins || config.options.tasks || config.options.hooks)
  ) {
    config.options = {
      plugins: config.options as { [id: string]: Record<string, unknown> }
    }

    logger.warn(
      `plugin at ${s.filepath(path.dirname(root))} has an ${s.code(
        'options'
      )} field that only contains plugin options. these options should be moved to ${s.code(
        'options.plugins'
      )}.`
    )
  }

  return {
    version: config.version ?? undefined,
    plugins: config.plugins ?? [],
    installs: config.installs ?? {},
    tasks: config.tasks ?? {},
    commands: config.commands ?? {},
    options: config.options
      ? {
          plugins: config.options.plugins ?? {},
          tasks: config.options.tasks ?? {},
          hooks: config.options.hooks ?? []
        }
      : { plugins: {}, tasks: {}, hooks: [] },
    hooks: config.hooks ?? undefined,
    init: config.init ?? []
  }
}
