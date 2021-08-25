import YAML from 'yawn-yaml/cjs'
import path from 'path'
import { promises as fs } from 'fs'

interface CircleConfig {
  workflows?: {
    [workflow: string]: {
      jobs?: (string | { [job: string]: unknown })[]
    }
  }
}

export default abstract class CircleCiConfigHook {
  _circleConfig?: YAML
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
    const { workflows } = (await this.getCircleConfig()).json as CircleConfig
    // If the config has just one workflow defined check that one, else check
    // the workflow named 'tool-kit'
    const workflowName =
      workflows && Object.keys(workflows).length === 2
        ? // If the objects has two keys we know at least one isn't 'version'
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Object.keys(workflows).find((workflow) => workflow !== 'version')!
        : 'tool-kit'
    const workflow = workflows?.[workflowName]
    const jobs = workflow?.jobs
    if (!jobs) {
      return false
    }

    return jobs.some(
      (job) =>
        (typeof job === 'string' && job === this.job) ||
        (typeof job === 'object' && job.hasOwnProperty(this.job))
    )
  }

  async install(): Promise<void> {
    // TODO automate this? humans can probably do it better than computers
    // TODO orbs
    throw new Error(
      `Please update your CircleCI config to include the \`${this.job}\` job in the 'tool-kit' workflow`
    )
  }
}
