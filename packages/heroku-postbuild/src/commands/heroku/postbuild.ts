import { Command } from '@oclif/command'

export default class HerokuPostbuild extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run() {
    console.log('heroku postbuild')
  }
}
