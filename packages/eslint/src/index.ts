import { LintStagedHook } from '@dotcom-tool-kit/lint-staged'
import Eslint from './tasks/eslint'
import { getOptions } from '@dotcom-tool-kit/options'

export const tasks = [Eslint]

class TestStaged extends LintStagedHook {
  static description = 'format prettier'

  glob = getOptions('@dotcom-tool-kit/eslint')?.lintStagedGlob ?? '**/*.js'
  hook = 'test:staged'
}

export const hooks = {
  'test:staged': TestStaged
}
