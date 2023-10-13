import HerokuProduction from './tasks/production'
import HerokuStaging from './tasks/staging'
import HerokuReview from './tasks/review'
import HerokuTeardown from './tasks/teardown'

export const tasks = { HerokuProduction, HerokuStaging, HerokuReview, HerokuTeardown }
