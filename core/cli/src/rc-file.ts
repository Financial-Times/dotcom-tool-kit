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

type RawRCFile = {
  [key in Exclude<keyof RCFile, 'options'>]?: RCFile[key] | null
} & {
  options:
    | {
        [key in keyof RCFile['options']]?: RCFile['options'][key] | null
      }
    | null
}


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

  const config: RawRCFile = YAML.parse(rawConfig)

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
