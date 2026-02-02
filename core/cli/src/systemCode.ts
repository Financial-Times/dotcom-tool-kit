import { readFile } from 'node:fs/promises'

import type { ValidConfig } from '@dotcom-tool-kit/config'
import type { RootOptions } from '@dotcom-tool-kit/plugin/src/root-schema'
import type DopplerSchema from '@dotcom-tool-kit/doppler/src/schema'

import type * as z from 'zod'

export async function guessSystemCode(config: ValidConfig): Promise<string | undefined> {
  const systemCodeFromRoot = (config.pluginOptions['app root']?.options as RootOptions | undefined)
    ?.systemCode
  if (systemCodeFromRoot) {
    return systemCodeFromRoot
  }

  const systemCodeFromDoppler = (
    config.pluginOptions['@dotcom-tool-kit/doppler']?.options as z.infer<typeof DopplerSchema> | undefined
  )?.project
  if (systemCodeFromDoppler && !systemCodeFromDoppler.startsWith('repo_')) {
    return systemCodeFromDoppler
  }

  try {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
    if (packageJson.name) {
      return `npm:${packageJson.name}`
    }
  } catch {}
}
