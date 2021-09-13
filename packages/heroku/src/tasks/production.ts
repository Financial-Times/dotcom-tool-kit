import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import getSlug from '../getSlug'
import setSlug from '../setSlug'
import getPipelineCouplings from '../getPipelineCouplings'

export default class HerokuProduction extends Task {
  static description = ''

  async run(): Promise<void> {
    try {
      console.log(`retreiving prod app id(s)...`)
      await getPipelineCouplings()

      console.log(`retreiving staging slug...`)
      const stagingSlugId = await getSlug()

      console.log(`promoting staging to production....`)
      await setSlug(stagingSlugId)
      console.log(`staging has been successfully promoted to production`)
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
