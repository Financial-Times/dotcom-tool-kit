import { ValidConfig } from '@dotcom-tool-kit/config'
import { readState, writeState } from '@dotcom-tool-kit/state'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { Logger } from 'winston'

export async function fileHash(path: string): Promise<string> {
  const hashFunc = createHash('sha512')
  try {
    hashFunc.update(await readFile(path))
    return hashFunc.digest('base64')
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return 'n/a'
    } else {
      throw error
    }
  }
}

export async function updateHashes(config: ValidConfig): Promise<void> {
  const hashes = Object.fromEntries(
    await Promise.all(
      ['.toolkitrc.yml', ...config.hookManagedFiles].map(async (path) => [path, await fileHash(path)])
    )
  )
  writeState('install', hashes)
}

export async function hasConfigChanged(logger: Logger, config: ValidConfig): Promise<boolean> {
  const hashes = readState('install')

  if (!hashes) {
    return true
  }

  for (const path of ['.toolkitrc.yml', ...config.hookManagedFiles]) {
    const newHash = await fileHash(path)
    const prevHash = hashes[path]

    if (newHash !== prevHash) {
      logger.debug(`hash for path ${path} has changed, running hook checks`)
      return true
    }
  }
  return false
}
