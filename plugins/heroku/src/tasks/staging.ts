import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { getHerokuStagingApp } from '../getHerokuStagingApp'
import { setStageConfigVars } from '../setConfigVars'
import { scaleDyno } from '../scaleDyno'
import { gtg } from '../gtg'
import { getPipelineCouplings } from '../getPipelineCouplings'
import { HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'

export default class HerokuStaging extends Task<typeof HerokuSchema> {
  static description = ''

  async run(): Promise<void> {
    try {
      if (!this.options.pipeline || !this.options.systemCode) {
        const error = new ToolKitError('no pipeline and/or system code option in your Tool Kit configuration')
        error.details = `the ${styles.plugin(
          'Heroku'
        )} plugin needs to know your pipeline name and Biz Ops' system code to deploy staging. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    pipeline: your-heroku-pipeline
    systemCode: your-system-code`

        throw error
      }

      this.logger.verbose(`retrieving pipeline details...`)
      await getPipelineCouplings(this.logger, this.options.pipeline)

      // setting config vars on staging from the vault production directory
      await setStageConfigVars(this.logger, 'staging', 'production', this.options.pipeline, this.options.systemCode)

      this.logger.verbose(`restrieving staging app details...`)
      const appName = await getHerokuStagingApp(this.logger)

      //scale up staging
      await scaleDyno(this.logger, appName, 1)

      await gtg(this.logger, appName, 'staging', false)
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
