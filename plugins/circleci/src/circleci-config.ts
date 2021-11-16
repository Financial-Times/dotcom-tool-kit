import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import isEqual from 'lodash.isequal'
import path from 'path'
import { Hook } from '@dotcom-tool-kit/types'

type JobConfig = {
  requires?: string[]
  filters?: { branches: { only?: string; ignore?: string } }
}

type TriggerConfig = {
  schedule?: { cron: string; filters?: { branches: { only?: string; ignore?: string } } }
}

type Workflow = {
  jobs?: (string | { [job: string]: JobConfig })[]
  triggers?: (string | { [trigger: string]: TriggerConfig })[]
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

export default abstract class CircleCiConfigHook extends Hook {
  circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  _circleConfigRaw?: string
  _circleConfig?: CircleConfig
  _versionTag?: string
  abstract job: string
  jobOptions: JobConfig = {}
  addToNightly?: boolean

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
    const workflows = config?.workflows as Record<string, Workflow | undefined> | undefined
    const jobs = workflows?.['tool-kit']?.jobs
    const nightlyJobs = workflows?.['nightly']?.jobs
    if (!jobs || !nightlyJobs) {
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

    function hasJob(expectedJob: string, jobs: NonNullable<Workflow['jobs']>): boolean {
      return jobs.some(
        (job) =>
          (typeof job === 'string' && job === expectedJob) ||
          (typeof job === 'object' && job.hasOwnProperty(expectedJob))
      )
    }

    return hasJob(this.job, jobs) && (!this.addToNightly || hasJob(this.job, nightlyJobs))
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
        },
        nightly: {
          triggers: [
            {
              schedule: {
                cron: '0 0 * * *',
                filters: { branches: { only: 'main' } }
              }
            }
          ],
          jobs: ['tool-kit/setup']
        }
      }
    }

    const currentVersion = await this.getVersionTag()
    if (!process.env.TOOL_KIT_FORCE_DEV_ORB && currentVersion && currentVersion !== developmentVersion) {
      config.orbs['tool-kit'] = `financial-times/dotcom-tool-kit@${currentVersion}`
    }

    if (
      !(config.workflows?.['tool-kit'] as Workflow).jobs ||
      !(config.workflows?.['nightly'] as Workflow).jobs
    ) {
      throw new Error(
        'Found malformed CircleCI config that was automatically generated. Please delete and install again'
      )
    }
    // TypeScript can't seem to pick up that we've already checked the optional
    // properties here
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const jobs = (config.workflows!['tool-kit'] as Workflow).jobs!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const nightlyJobs = (config.workflows!['nightly'] as Workflow).jobs!
    const job = this.jobOptions ? { [this.job]: this.jobOptions } : this.job
    // Avoid duplicating jobs (this can happen when check() fails when the version is wrong)
    if (!jobs.some((candidateJob) => isEqual(candidateJob, job))) {
      jobs.push(job)
      if (this.addToNightly) {
        // clone job and remove waiting for approvals
        const clonedJob = JSON.parse(JSON.stringify(job))
        clonedJob[this.job].requires = clonedJob[this.job].requires.filter(
          (x: string) => x !== 'waiting-for-approval'
        )
        nightlyJobs.push(clonedJob)
      }
    }

    const serialised = automatedComment + yaml.dump(config)
    // Enable recursive option so that mkdir doesn't throw if the directory
    // already exists.
    await fs.mkdir(path.dirname(this.circleConfigPath), { recursive: true })
    await fs.writeFile(this.circleConfigPath, serialised)
  }
}
