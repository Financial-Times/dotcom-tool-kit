import { Command } from '@oclif/command'
import Mocha from 'mocha'
import fs from 'fs'

export default class MochaCommand extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      const mocha = new Mocha()
      let fileNames = fs.readdirSync('./test')
      fileNames.forEach((file: string) =>{
         mocha.addFile(`./test/${file}`)
      })
      mocha
         .run()
   }
}