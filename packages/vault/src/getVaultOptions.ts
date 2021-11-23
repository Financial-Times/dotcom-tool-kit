import { VaultOptions } from '@dotcom-tool-kit/types/lib/schema/vault'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('toolkit', { ignoreEmptySearchPlaces: false })

export async function getVaultOptions(): Promise<VaultOptions> {
  try {
    const result = await explorer.search(process.cwd())
    const { team, app } = result?.config.options['@dotcom-tool-kit/vault']
    return { team, app }
  } catch {
    const error = new ToolKitError('unable to locate .toolkitrc.yml')
    error.details = `check that you've created a .toolkit.yml in the root of your project, see https://github.com/Financial-Times/dotcom-tool-kit#configuration`
    throw error
  }
}
