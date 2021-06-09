import { Command } from '@oclif/command'

export default class BabelProduction extends Command {
  static description = 'build babel'
  static args = []
  static flags = {}
  static hidden = true

  async run(): Promise<void> {
    console.log('babel production')
  }
}
