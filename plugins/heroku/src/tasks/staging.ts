import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { getHerokuStagingApp } from '../getHerokuStagingApp'
import { createBuild } from '../createBuild'
import { repeatedCheckForBuildSuccess } from '../repeatedCheckForBuildSuccess'
import { scaleDyno } from '../scaleDyno'
import { gtg } from '../gtg'
import { getPipelineCouplings } from '../getPipelineCouplings'
import type HerokuSchema from '../schema'
import { setStagingSlug } from '../setStagingSlug'

export default class HerokuStaging extends Task<{ plugin: typeof HerokuSchema }> {
  async run(): Promise<void> {
    try {
      this.logger.verbose(`retrieving pipeline details...`)
      await getPipelineCouplings(this.logger, this.pluginOptions.pipeline)

      this.logger.verbose(`retrieving staging app details...`)
      const appName = await getHerokuStagingApp()

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
