import { Task } from '@dotcom-tool-kit/task'
import MochaCore from 'mocha'
import { glob } from 'glob'
import { ToolKitError } from '@dotcom-tool-kit/error'

type MochaOptions = {
  files: string
}

export default class Mocha extends Task {
  static description = ''

  static defaultOptions: MochaOptions = {
    files: 'test/**/*.js'
  }

  constructor(public options: MochaOptions = Mocha.defaultOptions) {
    super()
  }

  async run(): Promise<void> {
    const mocha = new MochaCore()
    console.log(this.options)

    const files = glob.sync(this.options.files)
    if (files.length === 0) {
      const error = new ToolKitError('No test files found')
      error.details = `We looked for files matching ${this.options.files}, but there weren't any. Set options."@dotcom-tool-kit/mocha".files in your Tool Kit configuration to change this file pattern.`
      throw error
    }

    files.forEach((file) => {
      mocha.addFile(file)
    })

    await new Promise<void>((resolve, reject) => {
      mocha.run((failures) => {
        if (failures > 0) {
          const error = new ToolKitError('mocha tests failed')
          // empty details to prevent printing error stack
          error.details = ' '
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
