import { styles as s } from '@dotcom-tool-kit/logger'
import type { RCFile } from '@dotcom-tool-kit/plugin'
import { cosmiconfig } from 'cosmiconfig'
import * as path from 'path'
import type { Logger } from 'winston'

export const explorer = cosmiconfig('toolkit', { ignoreEmptySearchPlaces: false })
const emptyConfig = {
  plugins: [],
  installs: {},
  tasks: {},
  commands: {},
  options: { plugins: {} },
  hooks: [],
  init: []
} satisfies RCFile
let rootConfig: string | undefined

type RawRCFile = {
  [key in Exclude<keyof RCFile, 'options'>]?: RCFile[key] | null
} & {
  options: {
    [key in keyof RCFile['options']]?: RCFile['options'][key] | null
  }
}

export async function loadToolKitRC(logger: Logger, root: string, isAppRoot: boolean): Promise<RCFile> {
  const result = await explorer.search(root)

  if (!result?.config) {
    return emptyConfig
  }
  if (isAppRoot) {
    rootConfig = result.filepath
  } else if (result.filepath === rootConfig) {
    // Make sure that custom plugins which don't have a config file won't cause
    // the resolver to use the root config instead and start an infinite loop
    // of config resolution.
    logger.warn(
      `plugin at ${s.filepath(path.dirname(root))} has no config file. please add an empty ${s.filepath(
        '.toolkitrc'
      )} file to avoid potential config resolution issues.`
    )
    return emptyConfig
  }

  const config: RawRCFile = result.config
  return {
    plugins: config.plugins ?? [],
    installs: config.installs ?? {},
    tasks: config.tasks ?? {},
    commands: config.commands ?? {},
    options: config.options ? { plugins: config.options.plugins ?? {} } : { plugins: {} },
    hooks: config.hooks ?? [],
    init: config.init ?? []
  }
}
