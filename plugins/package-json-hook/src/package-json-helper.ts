import { z } from 'zod'
import { Hook } from '@dotcom-tool-kit/types'
import fs from 'fs'
import get from 'lodash/get'
import set from 'lodash/set'
import update from 'lodash/update'
import path from 'path'

import { PackageJsonSchema } from '@dotcom-tool-kit/types/lib/schema/hooks/package-json'

interface PackageJsonContents {
  [field: string]: PackageJsonContents | string
}

interface PackageJsonStateValue {
  commands: string[]
  trailingString?: string
  installedBy: PackageJson
}

interface PackageJsonState {
  [path: string]: PackageJsonStateValue
}

export default class PackageJson extends Hook<typeof PackageJsonSchema, PackageJsonState> {
  private _packageJson?: PackageJsonContents

  installGroup = 'package-json'

  filepath = path.resolve(process.cwd(), 'package.json')

  async getPackageJson(): Promise<PackageJsonContents> {
    if (!this._packageJson) {
      const rawPackageJson = await fs.promises.readFile(this.filepath, 'utf8')
      const packageJson = JSON.parse(rawPackageJson)
      this._packageJson = packageJson
      return packageJson
    }

    return this._packageJson
  }

  async isInstalled(): Promise<boolean> {
    const packageJson = await this.getPackageJson()

    // this instance's `options` is a nested object of expected package.json field/command mappings, e.g.
    // { "scripts": { "build": "build:local" } }. in the package.json, they'll have the same structure
    // with a `dotcom-tool-kit` CLI prefix, e.g. { "scripts": { "build": "dotcom-tool-kit build:local" } }.
    // loop through the nested options object, get the same nested key from package.json, and check that
    // field exists, and its string includes the name of the command. if any command from our options is
    // missing, the check should fail.
    for (const [field, object] of Object.entries(this.options)) {
      for (const [key, command] of Object.entries(object)) {
        const currentPackageJsonField = get(packageJson, [field, key])

        if (!currentPackageJsonField || !currentPackageJsonField.includes(command)) {
          return false
        }
      }
    }

    return true
  }

  async install(state: PackageJsonState = {}): Promise<PackageJsonState> {
    for (const [field, object] of Object.entries(this.options)) {
      for (const [key, entry] of Object.entries(object)) {
        let trailingString: string | undefined
        let commands: string[]

        if (Array.isArray(entry)) {
          commands = entry
        } else if (typeof entry === 'string') {
          commands = [entry]
        } else {
          commands = Array.isArray(entry.commands) ? entry.commands : [entry.commands]
          trailingString = entry.trailingString
        }

        update(
          state,
          [field + '.' + key],
          (hookState?: PackageJsonStateValue): PackageJsonStateValue => ({
            // prepend each command to maintain the same order as previous implementations
            commands: [...commands, ...(hookState?.commands ?? [])],
            installedBy: this,
            trailingString: trailingString
          })
        )
      }
    }

    return state
  }

  async commitInstall(state: PackageJsonState): Promise<void> {
    const packageJson = await this.getPackageJson()

    for (const [path, installation] of Object.entries(state)) {
      set(
        packageJson,
        path,
        `dotcom-tool-kit ${installation.commands.join(' ')}${
          installation.trailingString ? ' ' + installation.trailingString : ''
        }`
      )
    }

    await fs.promises.writeFile(this.filepath, JSON.stringify(packageJson, null, 2) + '\n')
  }
}
