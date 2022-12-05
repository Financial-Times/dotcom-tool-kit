import { PackageJsonHelper } from '@dotcom-tool-kit/package-json-hook'

export abstract class HuskyHook extends PackageJsonHelper {
  field = ['husky', 'hooks']
}
