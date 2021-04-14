import { Command } from '@oclif/command'

export default class WebpackProduction extends Command {
  static description = 'build webpack'
  static args = []
  static flags = {}
  static hidden = true

  async run() {
    console.log('webpack production')
  }
}
