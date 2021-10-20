import Prettier from './tasks/prettier'
import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

export const tasks = [Prettier]

class FormatLocal extends PackageJsonHook {
  static description = 'format prettier'

  script = 'format'
  hook = `format:local`
}

export const hooks = {
  'format:local': FormatLocal
}
