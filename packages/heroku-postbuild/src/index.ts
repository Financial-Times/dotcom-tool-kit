import loadPackageJson from '@financial-times/package-json'
import { ToolKitError } from '@dotcom-tool-kit/error'
import path from 'path'

function getPackageJson() {
  const currentDirectory = process.env.INIT_CWD || process.cwd()
  const filepath = path.resolve(currentDirectory, 'package.json')

  return loadPackageJson({ filepath })
}

export function ensureHerokuPostbuildScript(): boolean {
  const packageJson = getPackageJson()

  packageJson.requireScript({
    stage: 'heroku-postbuild',
    command: 'dotcom-tool-kit heroku:postbuild'
  })

  const willWrite = packageJson.hasChangesToWrite()
  if (willWrite) {
    packageJson.writeChanges()
  }

  return willWrite
}

export async function init(): Promise<void> {
  const wroteScript = ensureHerokuPostbuildScript()

  if (wroteScript) {
    const name: string = getPackageJson().getField('name')

    throw new ToolKitError(
      `@dotcom-tool-kit/heroku-postbuild added a heroku-postbuild script to ${name}'s package.json. you should commit this.`
    )
  }
}

export { default as commands } from './commands'
