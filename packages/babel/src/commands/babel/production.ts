import { Command } from '@dotcom-tool-kit/command'

export default class BabelProduction extends Command {
  static description = 'build babel'
  static hidden = true

  async run(): Promise<void> {
    console.log('babel production')
  }
}
