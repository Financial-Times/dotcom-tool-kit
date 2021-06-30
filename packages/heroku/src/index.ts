import HerokuProduction from './commands/production'
import HerokuStaging from './commands/staging'
import HerokuReview from './commands/review'
import HerokuCleanup from './commands/cleanup'

export const commands = {
  'heroku:production': HerokuProduction,
  'heroku:staging': HerokuStaging,
  'heroku:review': HerokuReview,
  'heroku:cleanup': HerokuCleanup
}
