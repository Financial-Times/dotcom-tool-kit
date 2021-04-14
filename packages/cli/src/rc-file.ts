import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('toolkit')

interface RCFile {
   plugins: string[],
   lifecycles: { [id: string]: string | string[] }
}

export async function loadToolKitRC(root: string): Promise<RCFile> {
   const result = await explorer.search(root)
   if (!result) return { plugins: [], lifecycles: {} }

   return result.config as RCFile
}
