import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

class BuildLocal extends PackageJsonHook {
  static description = 'hook for `npm run build`, for building an app locally'

  script = 'build'
  command = 'dotcom-tool-kit build:local'
}

class TestLocal extends PackageJsonHook {
  static description = 'hook for `npm run test`, for running tests locally'

  script = 'test'
  command = 'dotcom-tool-kit test:local'
}

export { PackageJsonHook }

export const hooks = {
  'build:local': BuildLocal,
  'test:local': TestLocal
}
