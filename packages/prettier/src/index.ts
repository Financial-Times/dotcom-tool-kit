import { LintStagedHook } from '@dotcom-tool-kit/lint-staged'
import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'
import Prettier from './tasks/prettier'
import { getOptions } from '@dotcom-tool-kit/options'

export const tasks = [Prettier]

class FormatLocal extends PackageJsonHook {
  static description = 'format prettier'

  script = 'format'
  hook = `format:local`
}

class FormatStaged extends LintStagedHook {
  static description = 'format prettier'

  glob = getOptions('@dotcom-tool-kit/prettier')?.lintStagedGlob ?? '**/*.js'
  hook = 'format:staged'
}

export const hooks = {
  'format:local': FormatLocal,
  'format:staged': FormatStaged
}
