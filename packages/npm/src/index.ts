import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

class BuildLocal extends PackageJsonHook {
  script = 'build'
  command = 'dotcom-tool-kit build:local'
}

class TestLocal extends PackageJsonHook {
  script = 'test'
  command = 'dotcom-tool-kit test:local'
}

export { PackageJsonHook }

export const hooks = {
  'build:local': BuildLocal,
  'test:local': TestLocal
}
