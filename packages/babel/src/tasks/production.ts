import { Task } from '@dotcom-tool-kit/task'

export default class BabelProduction extends Task {
  static description = 'build babel'

  async run(): Promise<void> {
    console.log('babel production')
  }
}
