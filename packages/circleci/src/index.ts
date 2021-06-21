import { writeState } from '@dotcom-tool-kit/state'

const envVars = {
  branch: process.env.CIRCLE_BRANCH,
  repo: process.env.CIRCLE_PR_REPONAME,
  version: process.env.CIRCLE_SHA1
}

;(async (): Promise<void> => {
  writeState(`ci`, envVars)
  return
})()
