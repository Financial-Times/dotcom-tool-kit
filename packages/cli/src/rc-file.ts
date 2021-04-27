import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('toolkit')

interface RCFile {
   plugins: string[],
   lifecycles: { [id: string]: string | string[] },
   options: { [id: string]: Object }
}

export async function loadToolKitRC(root: string): Promise<RCFile> {
   const result = await explorer.search(root)
   if (!result) return { plugins: [], lifecycles: {}, options: {} }

   return result.config as RCFile
}
