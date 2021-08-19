import YAML from 'yawn-yaml/cjs'
import path from 'path'
import { promises as fs } from 'fs'

type Step = {
  run?:
    | {
        name: string
        task: string
      }
    | string
}

export default abstract class CircleCiConfigHook {
  _circleConfig?: YAML
  abstract script: string
  abstract job: string

  async getCircleConfig(): Promise<YAML> {
    if (!this._circleConfig) {
      const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
      const yaml = await fs.readFile(circleConfigPath, 'utf8')
      this._circleConfig = new YAML(yaml)
    }

    return this._circleConfig
  }

  async check(): Promise<boolean> {
    const circleConfig = await this.getCircleConfig()
    const steps = circleConfig.json.jobs?.[this.job]?.steps as Step[] | undefined
    if (!steps) {
      // if the CircleCI config isn't what we expect (e.g. doesn't even have the right jobs)
      // return false so the install runs and explains the situation. this isn't ideal but
      // we can't easily control the overall structure of the config until we do orbs
      return false
    }

    for (const step of steps) {
      if (typeof step.run === 'string' && step.run === this.script) {
        return true
      }

      if (typeof step.run === 'object' && step.run.task === this.script) {
        return true
      }
    }

    return false
  }

  async install(): Promise<void> {
    // TODO automate this? humans can probably do it better than computers
    // TODO orbs
    throw new Error(
      `Please update your CircleCI config to run the command \`${this.script}\` in the steps of the \`${this.job}\` job`
    )
  }
}
