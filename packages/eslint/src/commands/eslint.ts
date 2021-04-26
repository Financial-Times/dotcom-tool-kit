import { Command } from '@oclif/command'
import { ESLint } from 'eslint'

export default class EslintCommand extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      const eslint = new ESLint()
      const results = await eslint.lintFiles('**/*.js')
      const formatter = await eslint.loadFormatter("stylish")
      const resultText = formatter.format(results);

      console.log(resultText)
   }
}
