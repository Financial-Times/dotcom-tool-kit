import { Task } from '@dotcom-tool-kit/base'
import mapWorkspaces from '@npmcli/map-workspaces'
import fs from 'fs/promises'
import path from 'path'

export default class WorkspaceCommand extends Task {
  async run() {
    const cwd = process.cwd()
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))

    // eslint-disable-next-line no-console
    console.log(Object.fromEntries(await mapWorkspaces({ cwd, pkg })))
  }
}
