import ServerlessDeploy from './tasks/deploy'
import ServerlessProvision from './tasks/provision'
import ServerlessRun from './tasks/run'

export const tasks = [ServerlessRun, ServerlessDeploy, ServerlessProvision]
