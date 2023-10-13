import { PackageJsonScriptHook } from '@dotcom-tool-kit/package-json-hook'
import NpmPrune from './tasks/npm-prune'
import NpmPublish from './tasks/npm-publish'

export { PackageJsonScriptHook as PackageJsonScriptHook }

export const tasks = {
  NpmPrune,
  NpmPublish
}
