import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'
import { HuskyHook } from '@dotcom-tool-kit/husky-hook'
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

class GitPrecommit extends HuskyHook {
  gitHook = 'pre-commit'
  hook = 'git:precommit'
}

export { PackageJsonHook }

export const hooks = {
  'build:local': BuildLocal,
  'test:local': TestLocal,
  'run:local': RunLocal,
  'git:precommit': GitPrecommit
}

export const tasks = [NpmPrune]
