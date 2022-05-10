import { cosmiconfig } from 'cosmiconfig'

export const explorer = cosmiconfig('toolkit', { ignoreEmptySearchPlaces: false })

interface RawRCFile {
  plugins?: string[] | null
  hooks?: { [id: string]: string | string[] } | null
  options?: { [id: string]: Record<string, unknown> } | null
}

export interface RCFile {
  plugins: string[]
  hooks: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
}

export async function loadToolKitRC(root: string): Promise<RCFile> {
  const result = (await explorer.search(root)) as { config: RawRCFile | null } | null
  if (!result || !result.config) return { plugins: [], hooks: {}, options: {} }

  return {
    plugins: result.config.plugins ?? [],
    hooks: result.config.hooks ?? {},
    options: result.config.options ?? {}
  }
}
