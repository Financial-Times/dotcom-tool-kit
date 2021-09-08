import prompt from 'prompts'
import path from 'path'
import * as yaml from 'js-yaml'
import loadPackageJson from '@financial-times/package-json'
import type { RCFile } from 'dotcom-tool-kit/src/rc-file'
import { exec as _exec } from 'child_process'
import Komatsu, { LogPromiseLabels } from 'komatsu'
import type { Spinner, Status } from 'komatsu'
import { promises as fs } from 'fs'
import { promisify } from 'util'
import { readFileSync } from 'fs'

// TODO backport this to Komatsu mainline?
class Logger extends Komatsu {
  stop() {
    if (
      !Array.from(this.spinners.values()).some(
        (spinner: Spinner | { status: 'not-started' }) => spinner.status === 'not-started'
      )
    )
      super.stop()
  }

  renderSymbol(spinner: Spinner | { status: 'not-started' }) {
    if (spinner.status === 'not-started') {
      return '-'
    }

    return super.renderSymbol(spinner)
  }

  async logPromiseWait<T, U>(wait: Promise<T>, run: (interim: T) => Promise<U>, label: string): Promise<U> {
    const id = Math.floor(parseInt(`zzzzzz`, 36) * Math.random())
      .toString(36)
      .padStart(6, '0')

    const labels = {
      waiting: `not ${label} yet`,
      pending: label,
      done: `finished ${label}`,
      fail: `error with ${label}`
    }

    this.log(id, { message: labels.waiting, status: 'not-started' })

    const interim = await wait

    this.log(id, { message: labels.pending })

    try {
      const result = await run(interim)
      this.log(id, { status: 'done', message: labels.done })
      return result
    } catch (error: any) {
      this.log(id, {
        status: 'fail',
        message: labels.fail,
        error
      })

      error.logged = true
      throw error
    }
  }
}

const exec = promisify(_exec)

const { version }: { version: string } = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
)

const packagesToInstall = ['dotcom-tool-kit']
const toolKitConfig: RCFile = {
  plugins: [],
  hooks: {},
  options: {}
}

async function main() {
  const filepath = path.resolve(process.cwd(), 'package.json')
  const packageJson = loadPackageJson({ filepath })
  const logger = new Logger()

  const { preset } = await prompt([
    {
      name: 'preset',
      type: 'select',
      message: `What kind of app is ${packageJson.getField('name')}?`,
      choices: [
        { title: 'A user-facing (frontend) app', value: 'frontend-app' },
        { title: 'A service/backend app', value: 'service-app' }
      ]
    }
  ])

  /* TODO
     - prompt to install any plugins not installed by the preset
     - prompt for required plugin options
	  - prompt for resolving Hook conflicts
	  - uninstall n-gage & n-heroku-tools
	  - delete makefile after checking there's else it's running that they need
  */

  packagesToInstall.push(`@dotcom-tool-kit/${preset}`)
  toolKitConfig.plugins.push(`@dotcom-tool-kit/${preset}`)

  const configFile = yaml.dump(toolKitConfig)

  console.log(`
so, we're gonna:

install the following packages:
${packagesToInstall.map((p) => `- ${p}`).join('\n')}

create a .toolkitrc.yml containing:
${configFile}
`)

  const { confirm }: { confirm: boolean } = await prompt([
    {
      name: 'confirm',
      type: 'confirm',
      message: 'sound good?'
    }
  ])

  if (confirm) {
    for (const pkg of packagesToInstall) {
      packageJson.requireDependency({
        pkg,
        version,
        field: 'devDependencies'
      })
    }

    packageJson.writeChanges()

    const installPromise = logger.logPromise(exec('npm install'), 'installing dependencies')

    const configPromise = logger.logPromise(
      fs.writeFile(path.join(process.cwd(), '.toolkitrc.yml'), configFile),
      'creating .toolkitrc.yml'
    )

    const initialTasks = Promise.all([installPromise, configPromise])

    const toolKitInstallPromise = logger.logPromiseWait(
      initialTasks,
      () => exec('npx dotcom-tool-kit --install'),
      'installing Tool Kit hooks'
    )

    await Promise.all([initialTasks, toolKitInstallPromise])
  }
}

main().catch((error) => {
  if (!error.logged) {
    console.log(error.stack)
  }
  process.exit(1)
})
