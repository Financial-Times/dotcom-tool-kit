import { promises as fs } from 'fs'
import * as yaml from 'js-yaml'
import merge from 'lodash.merge'
import path from 'path'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import { Hook } from '@dotcom-tool-kit/types'
import { semVerRegex } from '@dotcom-tool-kit/types/lib/npm'
import { Workflow, JobConfig, CircleConfig, automatedComment } from '@dotcom-tool-kit/types/lib/circleci'

const majorOrbVersion = '2'

interface CircleCIState {
  jobs: Record<string, JobConfig>
  nightlyJobs: Record<string, JobConfig>
  runOnVersionTags: boolean
  additionalFields: Record<string, unknown>
}

const tagFilter = { filters: { tags: { only: `${semVerRegex}` } } }

export default abstract class CircleCiConfigHook extends Hook<CircleCIState> {
  installGroup = 'circleci'

  circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  _circleConfigRaw?: string
  _circleConfig?: CircleConfig
  _versionTag?: string
  abstract job: string
  abstract jobOptions: JobConfig
  additionalFields?: Record<string, unknown>
  addToNightly?: boolean
  runOnVersionTags?: boolean

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
      const currentOrb = config?.orbs['tool-kit']
      const currentMajorTag = currentOrb && currentOrb.split('@')[1].split('.')[0]

      if (majorOrbVersion !== currentMajorTag) {
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

  async install(state?: CircleCIState): Promise<CircleCIState> {
    if (!state) {
      state = {
        jobs: {},
        nightlyJobs: {},
        runOnVersionTags: false,
        additionalFields: {}
      }
    }

    state.jobs[this.job] = this.jobOptions
    if (this.addToNightly) {
      state.nightlyJobs[this.job] = this.jobOptions
    }
    if (this.runOnVersionTags) {
      state.runOnVersionTags = true
    }
    merge(state.additionalFields, this.additionalFields)
    return state
  }

  async commitInstall(state: CircleCIState): Promise<void> {
    const rawConfig = await this.getCircleConfigRaw()
    if (rawConfig && !rawConfig.startsWith(automatedComment)) {
      const formatMissingHooks = (hooks: string[]): string => hooks.map(styles.hook).join(', ')
      throw new ToolKitError(
        `Please update your CircleCI config to include the ${formatMissingHooks(
          Object.keys(state.jobs)
        )} jobs in the ${styles.heading('tool-kit')} workflow and the ${formatMissingHooks(
          Object.keys(state.nightlyJobs)
        )} jobs in the ${styles.heading('nightly')} workflow`
      )
    }

    const nodeVersionOption = {
      'node-version': getOptions('@dotcom-tool-kit/circleci')?.nodeVersion ?? '16.14-browsers'
    }
    const orbJobs = [
      {
        'tool-kit/setup': {
          requires: ['checkout', 'waiting-for-approval']
        }
      },
      ...Object.entries(state.jobs).map(([job, options]) => ({
        [job]: {
          ...options
        }
      }))
    ]
    for (const job of orbJobs) {
      const options = Object.values(job)[0] // there should only ever be one field on the job
      Object.assign(options, nodeVersionOption)
      if (state.runOnVersionTags) {
        merge(options, tagFilter)
      }
    }

    const config = {
      version: 2.1,
      orbs: {
        'tool-kit': process.env.TOOL_KIT_FORCE_DEV_ORB
          ? 'financial-times/dotcom-tool-kit@dev:alpha'
          : `financial-times/dotcom-tool-kit@${majorOrbVersion}`
      },
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
        'tool-kit': {
          when: {
            not: {
              equal: ['scheduled_pipeline', '<< pipeline.trigger_source >>']
            }
          },
          jobs: [
            state.runOnVersionTags ? { checkout: tagFilter } : 'checkout',
            {
              'waiting-for-approval': {
                type: 'approval',
                filters: { branches: { only: '/(^renovate-.*|^nori/.*)/' } }
              }
            },
            ...orbJobs
          ]
        },
        nightly: {
          when: {
            and: [
              {
                equal: ['scheduled_pipeline', '<< pipeline.trigger_source >>']
              },
              {
                equal: ['nightly', '<< pipeline.schedule.name >>']
              }
            ]
          },
          jobs: [
            'checkout',
            ...[
              {
                'tool-kit/setup': {
                  requires: ['checkout']
                }
              },
              ...Object.entries(state.nightlyJobs).map(([job, options]) => ({
                [job]: {
                  ...options,
                  requires: options.requires?.filter((x: string) => x !== 'waiting-for-approval')
                }
              }))
            ].map((job) => {
              Object.assign(Object.values(job)[0], nodeVersionOption)
              return job
            })
          ]
        }
      }
    }
    merge(config, state.additionalFields)

    const serialised = automatedComment + yaml.dump(config, { noRefs: true })
    const circleConfigDir = path.dirname(this.circleConfigPath)
    this.logger.verbose(`making directory at ${styles.filepath(circleConfigDir)}...`)
    // Enable recursive option so that mkdir doesn't throw if the directory
    // already exists.
    await fs.mkdir(circleConfigDir, { recursive: true })
    this.logger.info(`writing CircleCI config to ${styles.filepath(this.circleConfigPath)}...`)
    await fs.writeFile(this.circleConfigPath, serialised)
  }
}
