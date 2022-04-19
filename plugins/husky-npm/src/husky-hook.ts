import { PackageJsonHelper } from '@dotcom-tool-kit/package-json-hook'

type HuskyField = {
  hooks?: {
    [hook: string]: string
  }
}

export abstract class HuskyHook extends PackageJsonHelper {
  field = 'husky'

  async install(): Promise<void> {
    let command = `dotcom-tool-kit ${this.hook}`

    const huskyHooks = this.packageJson.getField<HuskyField>(this.field) || {}

    if(!huskyHooks.hooks) {
      huskyHooks.hooks = {}
    }

    const existingCommand = huskyHooks.hooks[this.key]

    if (existingCommand?.startsWith('dotcom-tool-kit ')) {
      command = command.concat(existingCommand.replace('dotcom-tool-kit', ''))
    }

    huskyHooks.hooks[this.key] = command

    this.packageJson.setField(this.field, huskyHooks)
    this.packageJson.writeChanges()
  }

  async check(): Promise<boolean> {
    const husky = this.packageJson.getField<HuskyField>(this.field)
    return husky?.hooks?.[this.key]?.includes(this.hook) ?? false
  }
}
