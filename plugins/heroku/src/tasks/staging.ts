import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { getHerokuStagingApp } from '../getHerokuStagingApp.js'
import { setAppConfigVars } from '../setConfigVars.js'
import { createBuild } from '../createBuild.js'
import { repeatedCheckForBuildSuccess } from '../repeatedCheckForBuildSuccess.js'
import { scaleDyno } from '../scaleDyno.js'
import { gtg } from '../gtg.js'
import { getPipelineCouplings } from '../getPipelineCouplings.js'
import { HerokuSchema } from '@dotcom-tool-kit/schemas/lib/plugins/heroku'
import { setStagingSlug } from '../setStagingSlug.js'

export default class HerokuStaging extends Task<{ plugin: typeof HerokuSchema }> {
  async run(): Promise<void> {
    try {
      this.logger.verbose(`retrieving pipeline details...`)
      await getPipelineCouplings(this.logger, this.pluginOptions.pipeline)

      this.logger.verbose(`retrieving staging app details...`)
      const appName = await getHerokuStagingApp()

      // setting config vars on staging from the doppler production directory
      await setAppConfigVars(this.logger, appName, 'prod', this.pluginOptions.systemCode)

      // create build from latest commit, even on no change
      const buildDetails = await createBuild(this.logger, appName)

      // wait for build to complete
      if (buildDetails.slug === null) {
        const id = await repeatedCheckForBuildSuccess(this.logger, appName, buildDetails.id)
        buildDetails.slug = { id }
      }

      // apply build
      await setStagingSlug(this.logger, appName, buildDetails.slug.id)

      //scale up staging
      await scaleDyno(this.logger, appName, 1)

      await gtg(this.logger, appName, 'staging')
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`there's an error with your staging app`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
