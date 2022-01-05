import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { HerokuSchema, HerokuOptions } from '@dotcom-tool-kit/types/lib/schema/heroku'
import { scaleDyno } from '../scaleDyno'
import { setSlug } from '../setSlug'

export default class HerokuProduction extends Task<typeof HerokuSchema> {
  static description = ''

  async run(): Promise<void> {
    try {
      console.log('retrieving staging slug...')
      const state = readState('staging')
      if (!state) {
        throw new ToolKitError('could not find staging state information')
      }
      const { slugId } = state

      console.log('promoting staging to production....')
      await setSlug(slugId)

      console.log('staging has been successfully promoted to production')

      const { scaling } = this.options as HerokuOptions

      if (!scaling) {
        const error = new ToolKitError('your heroku pipeline must have its scaling configured')
        error.details = `configure it in your .toolkitrc.yml, with a quantity and size for each production app, e.g.:

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
        console.log(`scaling app ${appName}...`)
        for (const [processType, { quantity, size }] of Object.entries(typeConfig)) {
          await scaleDyno(appName, quantity, processType, size)
        }
        console.log(`${appName} has been successfully scaled`)
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
}
