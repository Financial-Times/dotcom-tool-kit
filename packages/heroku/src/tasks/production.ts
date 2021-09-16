import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import setSlug from '../setSlug'
import getPipelineCouplings from '../getPipelineCouplings'

type HerokuProductionOptions = {
  pipeline?: string
}

export default class HerokuProduction extends Task {
  static description = ''

  static defaultOptions: HerokuProductionOptions = {
    pipeline: undefined
  }

  constructor(public options: HerokuProductionOptions = HerokuProduction.defaultOptions) {
    super()
  }

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
