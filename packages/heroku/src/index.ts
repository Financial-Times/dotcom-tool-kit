import HerokuProduction from './tasks/production'
import HerokuStaging from './tasks/staging'
import HerokuReview from './tasks/review'
import HerokuTeardown from './tasks/teardown'
import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

class BuildRemote extends PackageJsonHook {
  script = 'heroku-postbuild'
  command = 'dotcom-tool-kit build:remote'
}

class CleanupRemote extends PackageJsonHook {
  script = 'heroku-cleanup'
  command = 'dotcom-tool-kit cleanup:remote'
}

class ReleaseRemote extends PackageJsonHook {
  script = 'heroku-postbuild'
  command = 'dotcom-tool-kit release:remote'
}

export const hooks = {
  'build:remote': BuildRemote,
  'release:remote': ReleaseRemote,
  'cleanup:remote': CleanupRemote
}

export const tasks = [HerokuProduction, HerokuStaging, HerokuReview, HerokuTeardown]
