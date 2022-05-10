import { cosmiconfig } from 'cosmiconfig'
import { RCFile, RawRCFile } from '@dotcom-tool-kit/types/src'

export const explorer = cosmiconfig('toolkit', { ignoreEmptySearchPlaces: false })

export async function loadToolKitRC(root: string): Promise<RCFile> {
  const result = (await explorer.search(root)) as { config: RawRCFile | null } | null
  if (!result || !result.config) return { plugins: [], hooks: {}, options: {} }

  return {
    plugins: result.config.plugins ?? [],
    hooks: result.config.hooks ?? {},
    options: result.config.options ?? {}
  }
}
