import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import isEqual from 'lodash.isequal'
import path from 'path'

type JobConfig = {
  requires?: string[]
  filters?: { branches: { only?: string; ignore?: string } }
}

type Workflow = {
  jobs?: (string | { [job: string]: JobConfig })[]
}

interface CircleConfig {
  version: number
  orbs: { [orb: string]: string }
  workflows?: {
    version: number
    [workflow: string]: Workflow | number
  }
}

const automatedComment = '# CONFIG GENERATED BY DOTCOM-TOOL-KIT, DO NOT EDIT BY HAND\n'
const developmentVersion = '0.0.0-development'

export default abstract class CircleCiConfigHook {
  circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  _circleConfigRaw?: string
  _circleConfig?: CircleConfig
  _versionTag?: string
  abstract job: string
  jobOptions: JobConfig = {}

  async getCircleConfigRaw(): Promise<string | undefined> {
    if (!this._circleConfigRaw) {
      try {
        this._circleConfigRaw = await fs.readFile(this.circleConfigPath, 'utf8')
      } catch (err) {
        // Not an error if config file doesn't exist
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw err
        }
      }
    }

    return this._circleConfigRaw
  }

  async getCircleConfig(): Promise<CircleConfig | undefined> {
    if (!this._circleConfig) {
      const rawConfig = await this.getCircleConfigRaw()
      if (rawConfig) {
        this._circleConfig = yaml.load(rawConfig) as CircleConfig
      }
    }

    return this._circleConfig
  }

  async getVersionTag(): Promise<string | undefined> {
    if (!this._versionTag) {
      const currentManifest = await fs.readFile(path.join(__dirname, '../package.json'), 'utf8')
      if (currentManifest) {
        this._versionTag = JSON.parse(currentManifest).version
      }
    }

    return this._versionTag
  }

  async check(): Promise<boolean> {
    const config = await this.getCircleConfig()
    const workflows = config?.workflows
    // If the config has just one workflow defined check that one, else check
    // the workflow named 'tool-kit'
    const workflowName =
      workflows && Object.keys(workflows).length === 2
        ? // If the objects has two keys we know at least one isn't 'version'
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          Object.keys(workflows).find((workflow) => workflow !== 'version')!
        : 'tool-kit'
    const workflow = workflows?.[workflowName] as Workflow | undefined
    const jobs = workflow?.jobs
    if (!jobs) {
      return false
    }

    // Automatically update tool kit orb if config is autogenerated
    const rawConfig = await this.getCircleConfigRaw()
    if (rawConfig && rawConfig.startsWith(automatedComment)) {
      const targetTag = await this.getVersionTag()
      const currentOrb = config?.orbs['tool-kit']
      const currentTag = currentOrb && currentOrb.split('@')[1]

      if (targetTag && targetTag !== developmentVersion && currentTag && targetTag !== currentTag) {
        return false
      }
    }

    return jobs.some(
      (job) =>
        (typeof job === 'string' && job === this.job) ||
        (typeof job === 'object' && job.hasOwnProperty(this.job))
    )
  }

  async install(): Promise<void> {
    const rawConfig = await this.getCircleConfigRaw()
    if (rawConfig && !rawConfig.startsWith(automatedComment)) {
      throw new Error(
        `Please update your CircleCI config to include the \`${this.job}\` job in the 'tool-kit' workflow`
      )
    }

    const config = (await this.getCircleConfig()) ?? {
      version: 2.1,
      orbs: { 'tool-kit': 'financial-times/dotcom-tool-kit@dev:alpha' },
      workflows: {
        version: 2,
        'tool-kit': {
          jobs: [
            'tool-kit/setup',
            {
              'waiting-for-approval': {
                type: 'approval',
                filters: { branches: { only: '/(^renovate-.*|^nori/.*)/' } }
              }
            }
          ]
        }
      }
    }

    const currentVersion = await this.getVersionTag()
    if (!process.env.TOOL_KIT_FORCE_DEV_ORB && currentVersion && currentVersion !== developmentVersion) {
      config.orbs['tool-kit'] = `financial-times/dotcom-tool-kit@${currentVersion}`
    }

    if (!(config.workflows?.['tool-kit'] as Workflow).jobs) {
      throw new Error(
        'Found malformed CircleCI config that was automatically generated. Please delete and install again'
      )
    }
    // TypeScript can't seem to pick up that we've already checked the optional
    // properties here
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const jobs = (config.workflows!['tool-kit'] as Workflow).jobs!
    const job = this.jobOptions ? { [this.job]: this.jobOptions } : this.job
    // Avoid duplicating jobs (this can happen when check() fails when the version is wrong)
    if (!jobs.some((candidateJob) => isEqual(candidateJob, job))) {
      jobs.push(job)
    }

    const serialised = automatedComment + yaml.dump(config)
    // Enable recursive option so that mkdir doesn't throw if the directory
    // already exists.
    await fs.mkdir(path.dirname(this.circleConfigPath), { recursive: true })
    await fs.writeFile(this.circleConfigPath, serialised)
  }
}
