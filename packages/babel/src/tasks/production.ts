import { Task } from '@dotcom-tool-kit/types'

export default class BabelProduction extends Task {
  static description = 'build babel'

  async run(): Promise<void> {
    console.log('babel production')
  }
}
