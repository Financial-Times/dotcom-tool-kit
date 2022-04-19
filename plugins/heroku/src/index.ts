import HerokuProduction from './tasks/production'
import HerokuStaging from './tasks/staging'
import HerokuReview from './tasks/review'
import HerokuTeardown from './tasks/teardown'
import { PackageJsonScriptHook } from '@dotcom-tool-kit/package-json-hook'

class BuildRemote extends PackageJsonScriptHook {
  key = 'heroku-postbuild'
  hook = 'build:remote'
}

class CleanupRemote extends PackageJsonScriptHook {
  key = 'heroku-postbuild'
  hook = 'cleanup:remote'
}

class ReleaseRemote extends PackageJsonScriptHook {
  key = 'heroku-postbuild'
  hook = 'release:remote'
}

export const hooks = {
  'cleanup:remote': CleanupRemote,
  'release:remote': ReleaseRemote,
  'build:remote': BuildRemote
}

export const tasks = [HerokuProduction, HerokuStaging, HerokuReview, HerokuTeardown]
