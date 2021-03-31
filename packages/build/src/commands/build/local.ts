import { Command } from '@oclif/command'

export default class BuildLocal extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run() {
    this.log('running build:local')
  }
}
