import { PackageJsonHelper } from '@dotcom-tool-kit/package-json-hook'

type LintStagedHooks = {
  [glob: string]: string
}

export abstract class LintStagedHook extends PackageJsonHelper {
  field = 'lint-staged'

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`
    const commands = this.packageJson.getField<LintStagedHooks>(this.field) || {}
    const existingCommand = commands[this.key]
    if (existingCommand?.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    } else {
      command = command.concat(' --')
    }
    commands[this.key] = command
    this.packageJson.setField(this.field, commands)

    this.packageJson.writeChanges()
  }
}
