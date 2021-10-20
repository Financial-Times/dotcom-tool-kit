import { LintStagedHook } from '@dotcom-tool-kit/lint-staged'
import { getOptions } from '@dotcom-tool-kit/options'

class TestStaged extends LintStagedHook {
  static description = 'format prettier'

  glob = getOptions('@dotcom-tool-kit/lint-staged-npm')?.testGlob ?? '**/*.js'
  hook = 'test:staged'
}

class FormatStaged extends LintStagedHook {
  static description = 'format prettier'

  glob = getOptions('@dotcom-tool-kit/lint-staged-npm')?.formatGlob ?? '**/*.js'
  hook = 'format:staged'
}

export const hooks = {
  'test:staged': TestStaged,
  'format:staged': FormatStaged
}
