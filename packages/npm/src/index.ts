import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'
import NpmPrune from './tasks/npm-prune'

class BuildLocal extends PackageJsonHook {
  static description = 'hook for `npm run build`, for building an app locally'

  script = 'build'
  hook = 'build:local'
}

class TestLocal extends PackageJsonHook {
  static description = 'hook for `npm run test`, for running tests locally'

  script = 'test'
  hook = 'test:local'
}

class RunLocal extends PackageJsonHook {
  static description = 'hook for `npm start`, for running your app locally'

  script = 'start'
  hook = 'run:local'
}

export { PackageJsonHook }

export const hooks = {
  'build:local': BuildLocal,
  'test:local': TestLocal,
  'run:local': RunLocal
}

export const tasks = [NpmPrune]
