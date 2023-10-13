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

export default abstract class PackageJson extends Hook<typeof PackageJsonSchema, PackageJsonState> {
  private _packageJson?: PackageJsonContents

  // Allow some extra characters to be appended to the end of a hooked field.
  // This is useful if you, for example, need to append the '--' argument
  // delimiter to commands to allow files to be passed as additional arguments.
  // TODO how to handle this with hook options
  trailingString?: string

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

  async check(): Promise<boolean> {
    const packageJson = await this.getPackageJson()
    return Object.entries(this.options).every(([field, object]) =>
      Object.entries(object).every(([key, command]) => get(packageJson, [field, key])?.includes(command))
    )
  }

  async install(state: PackageJsonState = {}): Promise<PackageJsonState> {
    for (const [field, object] of Object.entries(this.options)) {
      for (const [key, command] of Object.entries(object)) {
        // prepend each hook to maintain the same order as previous implementations
        update(
          state,
          [field + '.' + key],
          (hookState?: PackageJsonStateValue): PackageJsonStateValue => ({
            commands: [...(Array.isArray(command) ? command : [command]), ...(hookState?.commands ?? [])],
            installedBy: this,
            trailingString: this.trailingString
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
