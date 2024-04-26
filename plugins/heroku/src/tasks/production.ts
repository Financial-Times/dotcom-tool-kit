import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { styles } from '@dotcom-tool-kit/logger'
import { HerokuSchema } from '@dotcom-tool-kit/schemas/lib/plugins/heroku'
import type { HerokuApiResGetApp } from 'heroku-client'
import heroku, { extractHerokuError } from '../herokuClient'
import { scaleDyno } from '../scaleDyno'
import { promoteStagingToProduction } from '../promoteStagingToProduction'
import { HerokuProductionSchema } from '@dotcom-tool-kit/schemas/src/tasks/heroku-production'

export default class HerokuProduction extends Task<{
  plugin: typeof HerokuSchema
  task: typeof HerokuProductionSchema
}> {
  async run(): Promise<void> {
    try {
      this.logger.verbose('retrieving staging slug...')
      const state = readState('staging')
      if (!state) {
        throw new ToolKitError('could not find staging state information')
      }
      const { slugId } = state

      const { scaling } = this.options

      const scale = async () => {
        for (const [appName, typeConfig] of Object.entries(scaling)) {
          this.logger.verbose(`scaling app ${styles.app(appName)}...`)
          for (const [processType, { quantity, size }] of Object.entries(typeConfig)) {
            await scaleDyno(this.logger, appName, quantity, processType, size)
          }
          this.logger.info(`${styles.app(appName)} has been successfully scaled`)
        }
      }
      const promote = async () => {
        this.logger.verbose('promoting staging to production....')
        await promoteStagingToProduction(this.logger, slugId, this.pluginOptions.systemCode)
        this.logger.info('staging has been successfully promoted to production')
      }

      const productionState = readState('production')
      const appIds = productionState?.appIds ?? []

      // We want to scale apps before promoting them to production as the
      // preboot phase after promotion can take minutes and scaling is not
      // possible during that time. However, scaling will fail if this is the
      // first time the app has been deployed, so do the deployment first then.
      // Hopefully, there shouldn't be a preboot phase if we don't need to
      // switch from an old version either so it should be safe to scale the
      // app immediately afterwards. Maybe.
      if (await this.fetchIfAppHasDeployed(appIds[0])) {
        await scale()
        await promote()
      } else {
        // HACK: the simplest way to test Heroku changes
        this.logger.info(
          'if you see this log in CircleCI then please message the #cp-platforms-team and receive a free drink of your choice'
        )
        await promote()
        await scale()
      }
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError("there's an error with your production app")
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }

  async fetchIfAppHasDeployed(appId: string): Promise<boolean> {
    this.logger.verbose(`retrieving app info for ${appId}`)
    const appInfo = await heroku
      .get<HerokuApiResGetApp>(`/apps/${appId}`)
      .catch(extractHerokuError(`getting slug size for app ${appId}`))
    return appInfo.slugSize !== null
  }
}
