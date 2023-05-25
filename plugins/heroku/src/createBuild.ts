import type { Logger } from 'winston'
import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResBuild } from 'heroku-client'
import { getRepoDetails } from './githubApi'

async function createBuild(logger: Logger, appName: string): Promise<HerokuApiResBuild> {
  logger.info(`getting latest tarball path for ${appName}...`)
  const { branch, source_blob } = await getRepoDetails(logger)
  logger.info(`creating new build for ${appName} from ${branch || source_blob.version}...`)
  const buildInfo = await heroku
    .post<HerokuApiResBuild>(`/apps/${appName}/builds`, {
      body: {
        source_blob: {
          ...source_blob,
          checksum: null
        }
      }
    })
    .catch(extractHerokuError(`creating new build for app ${appName}`))
  return buildInfo
}

export { createBuild }
