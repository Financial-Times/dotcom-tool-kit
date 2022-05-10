import { hookConsole, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import MochaCore from 'mocha'
import { loadRc} from 'mocha/lib/cli';
import { glob } from 'glob'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { MochaOptions, MochaSchema } from '@dotcom-tool-kit/types/lib/schema/mocha'

export default class Mocha extends Task<typeof MochaSchema> {
  static description = ''

  static defaultOptions: MochaOptions = {
    files: 'test/**/*.js'
  }

  async run(): Promise<void> {
    const mocharc = loadRc()
    const mocha = new MochaCore(mocharc)

    const files = glob.sync(this.options.files)
    if (files.length === 0) {
      const error = new ToolKitError('No test files found')
      error.details = `We looked for files matching ${styles.filepath(
        this.options.files
      )}, but there weren't any. Set ${styles.title(
        'options."@dotcom-tool-kit/mocha".files'
      )} in your Tool Kit configuration to change this file pattern.`
      throw error
    }

    files.forEach((file) => {
      mocha.addFile(file)
    })

    const unhook = hookConsole(this.logger, 'mocha')
    await new Promise<void>((resolve, reject) => {
      mocha.run((failures) => {
        if (failures > 0) {
          const error = new ToolKitError('mocha tests failed')
          error.details = 'please fix the test failures and retry'
          reject(error)
        } else {
          resolve()
        }
      })
    }).finally(() => unhook())
  }
}
