import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import isEqual from 'lodash.isequal'
import path from 'path'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import { Hook } from '@dotcom-tool-kit/types'
import { Workflow, JobConfig, CircleConfig, automatedComment, ComputedJob } from '@dotcom-tool-kit/types/lib/circleci'

const majorOrbVersion = '2'

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
        this.logger.verbose(`trying to read CircleCI config at ${styles.filepath(this.circleConfigPath)}...`)
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

  getComputedJob(): Record<string, ComputedJob> {
    return {
      [this.job]: {
        'node-version': getOptions('@dotcom-tool-kit/circleci')?.nodeVersion ?? '16.14-browsers',
        ...this.jobOptions
      }
    }
  }

  async check(): Promise<boolean> {
    const config = await this.getCircleConfig()
    const workflows = config?.workflows as Record<string, Workflow | undefined> | undefined
    const jobs = workflows?.['tool-kit']?.jobs
    const nightlyJobs = workflows?.['nightly']?.jobs

    const computedJob = this.getComputedJob()

    if (!jobs || !nightlyJobs) {
      return false
    }

    // Automatically update tool kit orb if config is autogenerated
    const rawConfig = await this.getCircleConfigRaw()
    if (rawConfig && rawConfig.startsWith(automatedComment)) {
      const currentOrb = config?.orbs['tool-kit']
      const currentMajorTag = currentOrb && currentOrb.split('@')[1].split('.')[0]

      if (majorOrbVersion !== currentMajorTag) {
        return false
      }
    }

    function hasJob(expectedJob: any, jobs: NonNullable<Workflow['jobs']>): boolean {
      return jobs.some((job) => isEqual(expectedJob, job))
    }
    return hasJob(computedJob, jobs) && (!this.addToNightly || hasJob(computedJob, nightlyJobs))
  }

  async install(): Promise<void> {
    const rawConfig = await this.getCircleConfigRaw()
    if (rawConfig && !rawConfig.startsWith(automatedComment)) {
      throw new ToolKitError(
        `Please update your CircleCI config to include the \`${styles.hook(
          this.job
        )}\` job in the ${styles.heading('tool-kit')} workflow`
      )
    }

    const config = (await this.getCircleConfig()) ?? {
      version: 2.1,
      orbs: { 'tool-kit': 'financial-times/dotcom-tool-kit@dev:alpha' },
      jobs: {
        checkout: {
          docker: [{ image: 'cimg/base:stable' }],
          steps: [
            'checkout',
            {
              'tool-kit/persist-workspace': {
                path: '.'
              }
            }
          ]
        }
      },
      workflows: {
        version: 2,
        'tool-kit': {
          jobs: [
            'checkout',
            {
              'waiting-for-approval': {
                type: 'approval',
                filters: { branches: { only: '/(^renovate-.*|^nori/.*)/' } }
              }
            },
            {
              'tool-kit/setup': {
                requires: ['checkout', 'waiting-for-approval']
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
          jobs: [
            'checkout',
            {
              'tool-kit/setup': {
                requires: ['checkout']
              }
            }
          ]
        }
      }
    }

    if (!process.env.TOOL_KIT_FORCE_DEV_ORB) {
      config.orbs ??= {}
      config.orbs['tool-kit'] = `financial-times/dotcom-tool-kit@${majorOrbVersion}`
    }

    const workflows = config.workflows as Record<string, Workflow>
    const jobs = workflows?.['tool-kit']?.jobs
    const nightlyJobs = workflows?.['nightly']?.jobs
    const error = new ToolKitError('Found malformed CircleCI config that was automatically generated.')
    if (!jobs) {
      error.details = 'Please delete and install again'
      throw error
    }
    if (!nightlyJobs) {
      error.details = `The CircleCI config was missing a '${styles.heading(
        'nightly'
      )}' workflow, so was likely generated with an old version of the ${styles.plugin(
        'circleci'
      )} plugin. Please delete the config and install again`
      throw error
    }

    const computedJob = this.getComputedJob()

    const hasJob = (jobs: NonNullable<Workflow['jobs']>): boolean => {
      return !jobs.some((candidateJob, index) => { 
                if(Object.keys(candidateJob)[0] === this.job && !isEqual(candidateJob, computedJob)) {
                  jobs[index] = computedJob; return true
                }
                return false
      })
    }

    // Avoid duplicating jobs (this can happen when check() fails when the version is wrong). 
    // Replace original job with new job if it needs updating, and if job does not yet exist in config.yml we append.
    if (hasJob(jobs)) {
      jobs.push(computedJob)
    }
    if (this.addToNightly && hasJob(nightlyJobs)) {
      const nightlyJob = this.jobOptions
        ? {
            [this.job]: {
              ...this.jobOptions,
              requires: this.jobOptions.requires?.filter((x: string) => x !== 'waiting-for-approval')
            }
          }
        : this.job
      nightlyJobs.push(nightlyJob)
    }

    const serialised = automatedComment + yaml.dump(config, {noRefs: true})
    const circleConfigDir = path.dirname(this.circleConfigPath)
    this.logger.verbose(`making directory at ${styles.filepath(circleConfigDir)}...`)
    // Enable recursive option so that mkdir doesn't throw if the directory
    // already exists.
    await fs.mkdir(circleConfigDir, { recursive: true })
    this.logger.info(`writing CircleCI config to ${styles.filepath(this.circleConfigPath)}...`)
    await fs.writeFile(this.circleConfigPath, serialised)
  }
}
