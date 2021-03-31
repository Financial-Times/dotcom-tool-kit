import { Command } from '@oclif/command'

export default class BuildCI extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run() {
    this.log('running build:ci')
  }
}
