import { HuskyHook } from './husky-hook'

class GitPrecommit extends HuskyHook {
  key = 'pre-commit'
  hook = 'git:precommit'
}

export { HuskyHook }

export const hooks = {
  'git:precommit': GitPrecommit
}
