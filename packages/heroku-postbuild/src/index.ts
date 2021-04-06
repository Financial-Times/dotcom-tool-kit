import loadPackageJson from '@financial-times/package-json'
import { error } from '@oclif/errors'
import path from 'path'

function getPackageJson() {
   const currentDirectory = process.env.INIT_CWD || process.cwd()
   const filepath = path.resolve(currentDirectory, 'package.json')

   return loadPackageJson({ filepath })
}

export function ensureHerokuPostbuildScript() {
  const packageJson = getPackageJson()

  packageJson.requireScript({
    stage: 'heroku-postbuild',
    command: 'dotcom-tool-kit heroku:postbuild'
  })

  const willWrite = packageJson.hasChangesToWrite()
  packageJson.writeChanges()

  return willWrite
}

export async function init() {
  const wroteScript = ensureHerokuPostbuildScript()

  if (wroteScript) {
    const name: String = getPackageJson().getField('name')

    error(
      new Error(
        `@dotcom-tool-kit/heroku-postbuild added a heroku-postbuild script to ${name}'s package.json. you should commit this.`
      )
    )
  }
}

export { default as commands } from './commands'
