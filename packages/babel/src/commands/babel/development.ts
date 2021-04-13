import { Command } from '@oclif/command'

export default class BabelDevelopment extends Command {
  static description = 'build babel'
  static args = []
  static flags = {}
  static hidden = true

  async run() {
    console.log('babel development')
  }
}
