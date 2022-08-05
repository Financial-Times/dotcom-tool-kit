import { HuskyHook } from './husky-hook'

class GitPrecommit extends HuskyHook {
  key = 'pre-commit'
  hook = 'git:precommit'
}

class GitCommitmsg extends HuskyHook {
  key = 'commit-msg'
  hook = 'git:commitmsg'
}

export { HuskyHook }

export const hooks = {
  'git:precommit': GitPrecommit,
  'git:commitmsg': GitCommitmsg
}
