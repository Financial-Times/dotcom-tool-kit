import loadPackageJson from '@financial-times/package-json'
import type { PackageJson } from '@financial-times/package-json'
import path from 'path'

type Scripts = {
  [script: string]: string
}

export abstract class PackageJsonHook {
  _packageJson?: PackageJson
  abstract script: string
  abstract hook: string

  get packageJson(): PackageJson {
    if (!this._packageJson) {
      const filepath = path.resolve(process.cwd(), 'package.json')
      this._packageJson = loadPackageJson({ filepath })
    }

    return this._packageJson
  }

  async check(): Promise<boolean> {
    const scripts = this.packageJson.getField<Scripts>('scripts')
    return scripts && scripts[this.script].includes(this.hook)
  }

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook} `
    const existingCommand = this.packageJson.getField<Scripts>('scripts')[this.script]
    if (existingCommand && existingCommand.startsWith('dotcom-tool-kit ')) {
      command = this.hook.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }
    this.packageJson.requireScript({
      stage: this.script,
      command
    })

    this.packageJson.writeChanges()
  }
}
