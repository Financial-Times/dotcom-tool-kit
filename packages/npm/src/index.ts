import { PackageJsonLifecycleInstaller } from '@dotcom-tool-kit/lifecycle-package-json'

class BuildLocal extends PackageJsonLifecycleInstaller {
  script = 'build'
  command = 'dotcom-tool-kit lifecycle build:local'
}

class TestLocal extends PackageJsonLifecycleInstaller {
  script = 'test'
  command = 'dotcom-tool-kit lifecycle test:local'
}

export { PackageJsonLifecycleInstaller }

export const lifecycles = {
  'build:local': BuildLocal,
  'test:local': TestLocal
}
