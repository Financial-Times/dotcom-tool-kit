import HerokuProduction from './commands/production'
import HerokuStaging from './commands/staging'
import HerokuReview from './commands/review'
import HerokuCleanup from './commands/cleanup'
import { PackageJsonLifecycleInstaller } from '@dotcom-tool-kit/lifecycle-package-json'
import { ToolKitError } from '@dotcom-tool-kit/error'
import path from 'path'
import { promises as fs } from 'fs'

class BuildRemote extends PackageJsonLifecycleInstaller {
  script = 'heroku-postbuild'
  command = 'dotcom-tool-kit lifecycle build:remote'
}

type ProcfileEntry = { process: string; command: string }
type ProcfileError = { error: true; line: string }
type Procfile = ProcfileEntry[]

function isProcfileError(thing: any): thing is ProcfileError {
  return thing.error
}

abstract class ProcfileLifecycleInstaller {
  _procfile?: Procfile
  abstract process: string
  abstract command: string

  private get procfilePath() {
    return path.resolve(process.cwd(), 'Procfile')
  }

  private async readProcfile(): Promise<Procfile> {
    if (!this._procfile) {
      const content = await fs.readFile(this.procfilePath, 'utf-8').catch((error) => {
        // if the file doesn't exist, return empty string. the file'll get created later
        if (error.code && error.code === 'ENOENT') {
          return ''
        }

        throw error
      })

      this._procfile = this.parseProcfile(content)
    }

    return this._procfile
  }

  private parseProcfile(content: string): Procfile {
    // split into lines, skip empty lines, e.g. at end of file, or empty file
    const lines = content.split('\n').filter((line) => line.length > 0)

    const parsed = lines.map((line): ProcfileEntry | ProcfileError => {
      const [match, process, command] =
        /^([a-z\d]+):(.+)$/i.exec(line) || ([false, '', ''] as [boolean, string, string])

      if (!match) {
        return { error: true, line }
      }

      return { process: process.trim(), command: command.trim() }
    })

    const errors: ProcfileError[] = []
    const valid: Procfile = []

    for (const entry of parsed) {
      if (isProcfileError(entry)) {
        errors.push(entry)
      } else {
        valid.push(entry)
      }
    }

    if (errors.length) {
      const error = new ToolKitError(`Couldn't parse your Procfile. These lines are invalid:`)
      error.details = errors.map(({ line }) => line).join('\n')
      throw error
    }

    return valid
  }

  private formatProcfile(procfile: Procfile): string {
    return procfile.map(({ process, command }) => `${process}: ${command}`).join('\n')
  }

  private async writeProcfile(procfile: Procfile): Promise<void> {
    const content = this.formatProcfile(procfile)
    await fs.writeFile(this.procfilePath, content)
  }

  async check() {
    const procfile = await this.readProcfile()

    return procfile.some(({ process, command }) => process === this.process && command === this.command)
  }

  async install() {
    const procfile = await this.readProcfile()
    const existing = procfile.find(({ process }) => process === this.process)

    if (existing) {
      existing.command = this.command
    } else {
      procfile.push({
        process: this.process,
        command: this.command
      })
    }

    this.writeProcfile(procfile)
  }
}

class ReleaseRemote extends ProcfileLifecycleInstaller {
  process = 'release'
  command = 'npx dotcom-tool-kit lifecycle release:remote'
}

export const lifecycles = {
  'build:remote': BuildRemote,
  'release:remote': ReleaseRemote
}

export const commands = {
  'heroku:production': HerokuProduction,
  'heroku:staging': HerokuStaging,
  'heroku:review': HerokuReview,
  'heroku:cleanup': HerokuCleanup
}
