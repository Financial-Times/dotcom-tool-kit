import { writeState } from '@dotcom-tool-kit/state'

const envVars = {
  branch: process.env.CIRCLE_BRANCH,
  repo: process.env.CIRCLE_PR_REPONAME,
  verison: process.env.CIRCLE_SHA1
}

;(async (): Promise<void> => {
  for (const [key, val] of Object.entries(envVars)) {
    console.log(key, val)
    writeState(`ci`, key, val)
  }
  return
})()
