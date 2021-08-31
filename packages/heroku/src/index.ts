import HerokuProduction from './tasks/production'
import HerokuStaging from './tasks/staging'
import HerokuReview from './tasks/review'
import HerokuTeardown from './tasks/teardown'
import { PackageJsonHook } from '@dotcom-tool-kit/package-json-hook'

class BuildRemote extends PackageJsonHook {
  script = 'heroku-postbuild'
  hook = 'build:remote'
}

class CleanupRemote extends PackageJsonHook {
  script = 'heroku-cleanup'
  hook = 'cleanup:remote'
}

class ReleaseRemote extends PackageJsonHook {
  script = 'heroku-postbuild'
  hook = 'release:remote'
}

export const hooks = {
  'build:remote': BuildRemote,
  'release:remote': ReleaseRemote,
  'cleanup:remote': CleanupRemote
}

export const tasks = [HerokuProduction, HerokuStaging, HerokuReview, HerokuTeardown]
