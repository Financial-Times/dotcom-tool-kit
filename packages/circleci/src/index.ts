import { writeState } from '@dotcom-tool-kit/state'
import YAML from 'yawn-yaml/cjs'
import path from 'path'
import { promises as fs } from 'fs'

type Step = {
  [step: string]: any
  run?:
    | {
        name: string
        command: string
      }
    | string
}

class BuildCI {
  _circleConfig?: YAML
  script = 'npx dotcom-tool-kit lifecycle build:ci'

  async getCircleConfig() {
    if (!this._circleConfig) {
      const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
      const yaml = await fs.readFile(circleConfigPath, 'utf8')
      this._circleConfig = new YAML(yaml)
    }

    return this._circleConfig
  }

  async check(): Promise<boolean> {
    const circleConfig = await this.getCircleConfig()
    const buildSteps = circleConfig.json.jobs?.build?.steps as Step[] | undefined
    if (!buildSteps) {
      return false //??? what to do if the circleci config is something totally unexpected
    }

    for (const step of buildSteps) {
      if (typeof step.run === 'string' && step.run === this.script) {
        return true
      }

      if (typeof step.run === 'object' && step.run.command === this.script) {
        return true
      }
    }

    return false
  }

  async install() {
    // TODO automate this? humans can probably do it better than computers
    // TODO if other lifecycle installers need manual steps, collate those into a single message
    throw new Error(
      'Please update your CircleCI config to run the command `npx dotcom-tool-kit lifecycle build:ci` in the steps of the `build` job'
    )
  }
}

class TestCI {
  async check(): Promise<boolean> {
    return true
  }

  async install() {
    throw new Error('where does this even go')
  }
}

class TestRemote {
  async check(): Promise<boolean> {
    return true
  }

  async install() {
    throw new Error('where does this even go')
  }
}

export const lifecycles = {
  'build:ci': BuildCI,
  'test:ci': TestCI,
  'test:remote': TestRemote
}


const envVars = {
  branch: process.env.CIRCLE_BRANCH,
  repo: process.env.CIRCLE_PROJECT_REPONAME,
  version: process.env.CIRCLE_SHA1
}

function pluginInit() {
  if (process.env.CIRCLECI) {
    console.log(`writing circle ci environment variables to state...`)
    writeState('ci', envVars)
  }
}

pluginInit()
