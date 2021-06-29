import { Command } from '@dotcom-tool-kit/command'

export default class HerokuPostbuild extends Command {
  static description = ''

  async run(): Promise<void> {
    console.log('heroku postbuild')
  }
}
