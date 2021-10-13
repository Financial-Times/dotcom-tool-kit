import type { PackageJson } from '@financial-times/package-json'
import loadPackageJson from '@financial-times/package-json'
import path from 'path'

type HuskyHooks = {
  [hook: string]: string
}

export abstract class HuskyHook {
  _packageJson?: PackageJson
  abstract gitHook: string
  abstract hook: string

  get packageJson(): PackageJson {
    if (!this._packageJson) {
      const filepath = path.resolve(process.cwd(), 'package.json')
      this._packageJson = loadPackageJson({ filepath })
    }

    return this._packageJson
  }

  async check(): Promise<boolean> {
    const gitHooks = this.packageJson.getField<HuskyHooks>('husky')
    return gitHooks && gitHooks[this.gitHook]?.includes(this.hook)
  }

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`
    const huskyHooks = this.packageJson.getField<HuskyHooks>('husky') || {}
    const existingCommand = huskyHooks[this.gitHook]
    if (existingCommand?.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }
    huskyHooks[this.gitHook] = command
    this.packageJson.setField('husky', huskyHooks)

    this.packageJson.writeChanges()
  }
}
