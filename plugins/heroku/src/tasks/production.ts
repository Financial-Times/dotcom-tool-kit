import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'
import { scaleDyno } from '../scaleDyno'
import { setSlug } from '../setSlug'

export default class HerokuProduction extends Task<typeof HerokuSchema> {
  static description = ''

  async run(): Promise<void> {
    try {
      console.log(`retrieving staging slug...`)
      const state = readState('staging')
      if (!state) {
        throw new ToolKitError('could not find staging state information')
      }
      const { slugId } = state

      console.log(`promoting staging to production....`)
      await setSlug(slugId)

      console.log(`staging has been successfully promoted to production`)

      if (this.options.scale) {
        const { scale } = this.options
        console.log(`scaling to ${scale} processes...`)

        console.log('retrieving production app ID...')
        const state = readState('production')
        if (!state) {
          throw new ToolKitError('could not find production state information')
        }
        const { appIds } = state

        if (appIds.length > 1) {
          console.warn('tool kit can currently only scale your first app')
        }

        await scaleDyno(appIds[0], scale)
        console.log(`successfully scaled to ${scale} processes`)
      }
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`there was a problem promoting staging production`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
