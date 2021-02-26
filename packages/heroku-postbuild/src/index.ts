import { Hook } from '@oclif/config'
import * as loadPackageJson from '@financial-times/package-json'
import * as path from 'path'

function getPackageJson() {
  const filepath = path.resolve(process.cwd(), 'package.json')

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

const hook: Hook.Init = async function () {
  const wroteScript = ensureHerokuPostbuildScript()

  if (wroteScript) {
    const name = getPackageJson().getField('name')

    this.error(
      new Error(
        `@dotcom-tool-kit/heroku-postbuild added a heroku-postbuild script to ${name}'s package.json. you should commit this.`
      )
    )
  }
}

export default hook
