import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('toolkit', { ignoreEmptySearchPlaces: false })

export interface RCFile {
  plugins: string[]
  hooks: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
}

export async function loadToolKitRC(root: string): Promise<RCFile> {
  const result = await explorer.search(root)
  if (!result || !result.config) return { plugins: [], hooks: {}, options: {} }

  return result.config as RCFile
}
