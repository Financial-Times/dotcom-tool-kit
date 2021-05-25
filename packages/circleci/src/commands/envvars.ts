import { Command, flags } from '@oclif/command'
import { writeState } from '@dotcom-tool-kit/state' 

export default class CircleEnvVars extends Command {
  static description = ''
  static flags = {
    branch: flags.string({required: false}),
    repo: flags.string({required: false}),
    version: flags.string({required: false})
  }
  static args = []

  async run() {
    const { flags } = this.parse(CircleEnvVars)
    for (const [key, val] of Object.entries(flags)) {
    writeState(`ci`, key, val)
    }
    return
}}