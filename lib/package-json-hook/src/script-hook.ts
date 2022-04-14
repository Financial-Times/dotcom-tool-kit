import { PackageJsonHelper } from './package-json-helper'

type Scripts = {
  [script: string]: string
}

export abstract class PackageJsonScriptHook extends PackageJsonHelper {
  field = 'scripts'

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`
    const existingCommand = this.packageJson.getField<Scripts>(this.field)[this.key]
    if (existingCommand && existingCommand.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }
    this.packageJson.requireScript({
      stage: this.key,
      command
    })

    this.packageJson.writeChanges()
  }
}
