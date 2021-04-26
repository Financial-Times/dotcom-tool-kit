import { Command } from '@oclif/command'
import { ESLint } from 'eslint'

interface EslintOptions {
   files: string[] | string
}

export default class EslintCommand extends Command {
   static description = ''
   static flags = {}
   static args = []

   options: EslintOptions = {
      files: '**/*.js'
   }

   async run() {
      const eslint = new ESLint()
      const results = await eslint.lintFiles(this.options.files)
      const formatter = await eslint.loadFormatter("stylish")
      const resultText = formatter.format(results);

      console.log(resultText)
   }
}
