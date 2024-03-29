import { PackageJsonScriptHook } from '@dotcom-tool-kit/package-json-hook'
import Prettier from './tasks/prettier'

export const tasks = [Prettier]

class FormatLocal extends PackageJsonScriptHook {
  static description = 'format prettier'

  key = 'format'
  hook = `format:local`
}

export const hooks = {
  'format:local': FormatLocal
}
