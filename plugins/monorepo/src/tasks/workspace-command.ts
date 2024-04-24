import { Task } from '@dotcom-tool-kit/base'
import mapWorkspaces from '@npmcli/map-workspaces'
import fs from 'fs/promises'
import path from 'path'
import { loadConfig } from 'dotcom-tool-kit/lib/config'

export default class WorkspaceCommand extends Task {
  async run() {
    const cwd = process.cwd()
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))

    const workspaces = await mapWorkspaces({ cwd, pkg })

    const configs = Object.fromEntries(
      await Promise.all(
        Array.from(workspaces, async ([id, packagePath]) => [
          id,
          await loadConfig(this.logger, { root: packagePath })
        ])
      )
    )

    // eslint-disable-next-line no-console
    console.log(configs)
  }
}
