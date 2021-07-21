import { Command } from '@dotcom-tool-kit/command'
import { ToolKitError } from '@dotcom-tool-kit/error'
import getSlug from '../getSlug'
import setSlug from '../setSlug'
import gtg from '../gtg'

export default class HerokuProduction extends Command {
  static description = ''

  async run(): Promise<void> {
    try {
      //retrieve slug from staging
      const stagingSlugId = await getSlug()
      // replace production slug - api version of 'promotion'
      console.log(`Promoting staging to production....`)
      const appId = await setSlug(stagingSlugId)

      await gtg(appId, 'production', true)
      console.log(`Staging has been successfully promoted to production`)
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`There was a problem promoting staging production`)
      error.details = err.message
      throw error
    }
  }
}
