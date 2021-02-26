import { Command } from '@oclif/command'

export default class Development extends Command {
  static description = 'build development'
  static args = []
  static flags = {}
  async run() {
    this.log('i am building development')
  }
}
