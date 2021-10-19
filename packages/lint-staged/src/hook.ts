import type { PackageJson } from '@financial-times/package-json'
import loadPackageJson from '@financial-times/package-json'
import path from 'path'

type LintStagedHooks = {
  [glob: string]: string
}

export abstract class LintStagedHook {
  _packageJson?: PackageJson
  abstract glob: string
  abstract hook: string

  get packageJson(): PackageJson {
    if (!this._packageJson) {
      const filepath = path.resolve(process.cwd(), 'package.json')
      this._packageJson = loadPackageJson({ filepath })
    }

    return this._packageJson
  }

  async check(): Promise<boolean> {
    const commands = this.packageJson.getField<LintStagedHooks>('lint-staged')
    return commands?.[this.glob]?.includes(this.hook)
  }

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`
    const commands = this.packageJson.getField<LintStagedHooks>('lint-staged') || {}
    const existingCommand = commands[this.glob]
    if (existingCommand?.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }
    commands[this.glob] = command
    this.packageJson.setField('lint-staged', commands)

    this.packageJson.writeChanges()
  }
}
