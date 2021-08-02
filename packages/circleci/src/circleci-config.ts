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

export default abstract class CircleCiConfigLifecycle {
  _circleConfig?: YAML
  abstract script: string
  abstract job: string

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
    const steps = circleConfig.json.jobs?.[this.job]?.steps as Step[] | undefined
    if (!steps) {
      return false //??? what to do if the circleci config is something totally unexpected
    }

    for (const step of steps) {
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
    // TODO orbs
    throw new Error(
      `Please update your CircleCI config to run the command \`${this.script}\` in the steps of the \`${this.job}\` job`
    )
  }
}
