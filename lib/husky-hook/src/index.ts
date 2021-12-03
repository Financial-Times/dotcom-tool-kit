import { PackageJsonHelper } from '@dotcom-tool-kit/hook'

type HuskyHooks = {
  [hook: string]: string
}

export abstract class HuskyHook extends PackageJsonHelper {
  field = 'husky'

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`
    const huskyHooks = this.packageJson.getField<HuskyHooks>(this.field) || {}
    const existingCommand = huskyHooks[this.key]
    if (existingCommand?.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }
    huskyHooks[this.key] = command
    this.packageJson.setField(this.field, huskyHooks)

    this.packageJson.writeChanges()
  }
}
