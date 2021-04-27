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

   async run() {
      const mocha = new Mocha()
      let fileNames = fs.readdirSync(this.options.testDir)
      fileNames.forEach((file: string) =>{
         mocha.addFile(`${this.options.testDir}/${file}`)
      })
      mocha
         .run()
         //TODO: error handling
   }
}