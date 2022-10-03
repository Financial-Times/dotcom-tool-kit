import { PackageJsonHelper } from '@dotcom-tool-kit/package-json-hook'

export abstract class LintStagedHook extends PackageJsonHelper {
  field = 'lint-staged'
  trailingString = '--'
}
