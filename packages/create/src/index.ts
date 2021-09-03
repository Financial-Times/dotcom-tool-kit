import prompt from 'prompts'
import path from 'path'
import * as yaml from 'js-yaml'
import loadPackageJson from '@financial-times/package-json'
import type { RCFile } from 'dotcom-tool-kit/src/rc-file'
import { exec as _exec } from 'child_process'
import Komatsu from 'komatsu'
import { writeFile } from 'fs/promises'
import { promisify } from 'util'
import { readFileSync } from 'fs'

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
  const logger = new Komatsu()

  const { type } = await prompt([
    {
      name: 'type',
      type: 'select',
      message: `What kind of app is ${packageJson.getField('name')}?`,
      choices: [
        { title: 'A user-facing (frontend) app', value: 'frontend-app' },
        { title: 'A service/backend app', value: 'service-app' }
      ]
    }
  ])

  packagesToInstall.push(`@dotcom-tool-kit/${type}`)
  toolKitConfig.plugins.push(`@dotcom-tool-kit/${type}`)

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
      writeFile(path.join(process.cwd(), '.toolkitrc.yml'), configFile),
      'creating .toolkitrc.yml'
    )

    await Promise.all([installPromise, configPromise])
  }
}

main().catch((error) => {
  console.error(error.stack)
  process.exitCode = 1
})
