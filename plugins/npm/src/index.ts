import { PackageJsonScriptHook } from '@dotcom-tool-kit/package-json-hook'
import NpmPrune from './tasks/npm-prune'
import NpmPublish from './tasks/npm-publish'

class BuildLocal extends PackageJsonScriptHook {
  static description = 'hook for `npm run build`, for building an app locally'

  key = 'build'
  hook = 'build:local'
}

class TestLocal extends PackageJsonScriptHook {
  static description = 'hook for `npm run test`, for running tests locally'

  key = 'test'
  hook = 'test:local'
}

class RunLocal extends PackageJsonScriptHook {
  static description = 'hook for `npm start`, for running your app locally'

  key = 'start'
  hook = 'run:local'
}

export { PackageJsonScriptHook as PackageJsonScriptHook }

export const hooks = {
  'build:local': BuildLocal,
  'test:local': TestLocal,
  'run:local': RunLocal
}

export const tasks = {
  NpmPrune,
  NpmPublish
}
