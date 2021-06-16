import { PackageJsonLifecycleInstaller } from '@dotcom-tool-kit/lifecycle-package-json'

class TestCI {
  async check(): Promise<boolean> {
    return true
  }

  async install() {
    throw new Error('where does this even go')
  }
}

class TestLocal extends PackageJsonLifecycleInstaller {
  script = 'test'
  command = 'dotcom-tool-kit lifecycle test:local'
}

class TestDeploy {
  async check(): Promise<boolean> {
    return true
  }

  async install() {
    throw new Error('where does this even go')
  }
}

export const lifecycles = {
  'test:local': TestLocal,
  'test:ci': TestCI,
  'test:deploy': TestDeploy
}
