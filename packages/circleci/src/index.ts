import { writeState } from '@dotcom-tool-kit/state'

const circleEnvs = {
  repo_version: process.env.CIRCLE_SHA1,
  repo_name: process.env.CIRCLE_PROJECT_REPONAME,
  branch: process.env.CIRCLE_BRANCH
}

const run = () => {
  for (const [key, val] of Object.entries(circleEnvs)) {
   writeState(`ci`, key, val)
  }

}

(async () => {
  await run()
})();

