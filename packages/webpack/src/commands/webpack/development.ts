import { Command } from '@oclif/command'

export default class WebpackDevelopment extends Command {
  static description = 'build webpack'
  static args = []
  static flags = {}
  static hidden = true

  async run() {
    console.log('webpack development')
  }
}
