import { Hook } from '@dotcom-tool-kit/types'
import fs from 'fs'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import merge from 'lodash/merge'
import update from 'lodash/update'
import path from 'path'

interface PackageJsonContents {
  [field: string]: PackageJsonContents | string
}

interface PackageJsonStateValue {
  hooks: string[]
  trailingString: string
}

interface PackageJsonState {
  [field: string]: PackageJsonState | PackageJsonStateValue
}

export default abstract class PackageJson extends Hook<PackageJsonState> {
  private _packageJson?: PackageJsonContents
  abstract field: string | string[]
  abstract key: string
  abstract hook: string
  // Allow some extra characters to be appended to the end of a hooked field.
  // This is useful if you, for example, need to append the '--' argument
  // delimiter to commands to allow files to be passed as additional arguments.
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

  private get hookPath(): string[] {
    return Array.isArray(this.field) ? [...this.field, this.key] : [this.field, this.key]
  }

  async check(): Promise<boolean> {
    const packageJson = await this.getPackageJson()
    return get(packageJson, this.hookPath)?.includes(this.hook)
  }

  async install(state?: PackageJsonState): Promise<PackageJsonState> {
    state ??= {}
    // prepend each hook to maintain the same order as previous implementations
    update(state, this.hookPath, (hookState?: PackageJsonStateValue) => ({
      hooks: [this.hook, ...(hookState?.hooks ?? [])],
      trailingString: this.trailingString
    }))
    return state
  }

  async commitInstall(state: PackageJsonState): Promise<void> {
    const reduceHooks = (state: PackageJsonState): PackageJsonContents =>
      mapValues(state, (field) =>
        Array.isArray(field?.hooks)
          ? `dotcom-tool-kit ${field.hooks.join(' ')}${
              field.trailingString ? ' ' + field.trailingString : ''
            }`
          : reduceHooks(field as PackageJsonState)
      )

    const newPackageJson = merge(await this.getPackageJson(), reduceHooks(state))
    await fs.promises.writeFile(this.filepath, JSON.stringify(newPackageJson, null, 2) + '\n')
  }
}
