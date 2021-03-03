import { Command } from '@oclif/command'

export default class HerokuPostbuild extends Command {
  static description = ''
  static flags = {}
  static args = []

  async runCommand(name: string) {
    const command = this.config.findCommand(name)

    if(command) {
      const plugin = await command.load()
      return plugin.run()
    }
  }

  async run() {
    await this.runCommand('build:production')
  }
}
