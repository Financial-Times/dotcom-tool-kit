import { Init, InitContext } from '@dotcom-tool-kit/base'
import path from 'path'
import fs from 'fs/promises'
import type { ValidConfig } from '@dotcom-tool-kit/config'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import mapWorkspaces from '@npmcli/map-workspaces'
import { styles } from '@dotcom-tool-kit/logger'
import pluralize from 'pluralize'

interface WorkspaceConfig {
  packageId: string
  root: string
  config: ValidConfig
}

export default class LoadWorkspaceConfigs extends Init {
  private static _configs: WorkspaceConfig[] = []

  static get configs() {
    return LoadWorkspaceConfigs._configs
  }

  private static set configs(configs: WorkspaceConfig[]) {
    LoadWorkspaceConfigs._configs = configs
  }

  async init({ cwd }: InitContext) {
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))
    const workspaces = await mapWorkspaces({ cwd, pkg })
    const results = await Promise.allSettled(
      Array.from(workspaces, async ([packageId, root]) => ({
        packageId,
        root,
        config: await loadConfig(this.logger, { root }).catch((error) => {
          error.name = `${styles.plugin(packageId)} → ${error.name}`
          throw error
        })
      }))
    )

    const erroredConfigs = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredConfigs.length) {
      throw new AggregateError(
        erroredConfigs.map((result) => result.reason),
        `${pluralize('error', erroredConfigs.length, true)} loading ${styles.filepath(
          '.toolkitrc.yml'
        )} in workspace packages`
      )
    }

    LoadWorkspaceConfigs.configs = results
      .filter((result): result is PromiseFulfilledResult<WorkspaceConfig> => result.status === 'fulfilled')
      .map((result) => result.value)
  }
}
