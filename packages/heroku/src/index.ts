import HerokuProduction from './commands/production'
import HerokuStaging from './commands/staging'
import HerokuReview from './commands/review'
import HerokuCleanup from './commands/cleanup'
import { PackageJsonLifecycleInstaller } from '@dotcom-tool-kit/lifecycle-package-json'

class BuildRemote extends PackageJsonLifecycleInstaller {
  script = 'heroku-postbuild'
  command = 'dotcom-tool-kit lifecycle build:remote'
}

export const lifecycles = {
  'build:remote': BuildRemote
}

export const commands = {
  'heroku:production': HerokuProduction,
  'heroku:staging': HerokuStaging,
  'heroku:review': HerokuReview,
  'heroku:cleanup': HerokuCleanup
}