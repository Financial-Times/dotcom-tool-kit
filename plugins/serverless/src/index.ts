import ServerlessDeploy from './tasks/deploy'
import ServerlessProvision from './tasks/provision'
import ServerlessRun from './tasks/run'
import ServerlessTeardown from './tasks/run'

export const tasks = [ServerlessRun, ServerlessDeploy, ServerlessProvision, ServerlessTeardown]
