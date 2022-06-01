import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { styles } from '@dotcom-tool-kit/logger'
import { HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'
import { scaleDyno } from '../scaleDyno'
import { promoteStagingToProduction } from '../promoteStagingToProduction'

export default class HerokuProduction extends Task<typeof HerokuSchema> {
  static description = ''

  async run(): Promise<void> {
    try {
      this.logger.verbose('retrieving staging slug...')
      const state = readState('staging')
      if (!state) {
        throw new ToolKitError('could not find staging state information')
      }
      const { slugId } = state

      const { scaling } = this.options

      if (!scaling) {
        const error = new ToolKitError('your heroku pipeline must have its scaling configured')
        error.details = `configure it in your ${styles.filepath(
          '.toolkitrc.yml'
        )}, with a quantity and size for each production app, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    scaling:
      ft-next-static-eu:
        web:
          size: standard-1x
          quantity: 2`

        throw error
      }

      for (const [appName, typeConfig] of Object.entries(scaling)) {
        this.logger.verbose(`scaling app ${styles.app(appName)}...`)
        for (const [processType, { quantity, size }] of Object.entries(typeConfig)) {
          await scaleDyno(this.logger, appName, quantity, processType, size)
        }
        this.logger.info(`${styles.app(appName)} has been successfully scaled`)
      }

      this.logger.verbose('promoting staging to production....')
      await promoteStagingToProduction(this.logger, slugId, this.options.systemCode)

      this.logger.info('staging has been successfully promoted to production')
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
}
