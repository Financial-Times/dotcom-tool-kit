import { Task } from '@dotcom-tool-kit/types'

export default class BabelDevelopment extends Task {
  static description = 'build babel'

  async run(): Promise<void> {
    console.log('babel development')
  }
}
