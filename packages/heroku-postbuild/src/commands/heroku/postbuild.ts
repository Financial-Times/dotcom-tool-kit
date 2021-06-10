import { Command } from '@oclif/command'

export default class HerokuPostbuild extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run(): Promise<void> {
    console.log('heroku postbuild')
  }
}
