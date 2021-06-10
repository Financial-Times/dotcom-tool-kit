import { Command } from '@oclif/command'
import Mocha from 'mocha'
import fs from 'fs'

interface MochaOptions {
  testDir: string
}

export default class MochaCommand extends Command {
  static description = ''
  static flags = {}
  static args = []

  options: MochaOptions = {
    testDir: './test'
  }

  async run(): Promise<void> {
    const mocha = new Mocha()
    let fileNames: string[]

    try {
      fileNames = fs.readdirSync(this.options.testDir)
      fileNames.forEach((file: string) => {
        mocha.addFile(`${this.options.testDir}/${file}`)
      })
    } catch (error) {
      console.log(
        `Something went wrong: please ensure your tests are in ./test, or their location is configured in your project's .toolkitrc.yml`
      )
    }

    mocha.run()
    //TODO: error handling
  }
}
