import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import { Hook } from '@dotcom-tool-kit/types'
import { automatedComment, CircleConfig, Job, JobConfig, Workflow } from '@dotcom-tool-kit/types/lib/circleci'
import { semVerRegex } from '@dotcom-tool-kit/types/lib/npm'
import { promises as fs } from 'fs'
import { diffStringsUnified } from 'jest-diff'
import isPlainObject from 'lodash/isPlainObject'
import isMatch from 'lodash/isMatch'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import path from 'path'
import type { PartialDeep } from 'type-fest'
import YAML from 'yaml'

const majorOrbVersion = '4'

export type CircleCIState = CircleConfig
/**
 * CircleCIStatePartial makes every property in the config object optional,
 * including nested properties. This is particularly useful as we merge each
 * hook's config into the larger state, and so each hook only needs to define
 * the parts of the config they want to add to.
 */
export type CircleCIStatePartial = PartialDeep<CircleCIState>

// These boilerplate objects are (typically) needed for each job. They can be
// spread into your custom config, and are automatically included when calling
// generateSimpleJob.

/**
 * Every Tool Kit job, including jobs in the `nightly` workflow, uses the
 * executor we define at the top of the CircleCI config, which specifies the
 * version of Node to use.
 */
export const nightlyBoilerplate = {
  executor: 'node'
}
/**
 * tagFilter sets the regex for GitHub release tags: CircleCI will ignore jobs
 * when doing a release if the filter isn't made explicit
 */
export const tagFilter = { filters: { tags: { only: `${semVerRegex}` } } }
/**
 * jobBoilerplate is the config needed for all Tool Kit jobs in the `tool-kit`
 * workflow, and combines the `nightlyBoilerplate` and `tagFilter` objects.
 */
export const jobBoilerplate = {
  ...nightlyBoilerplate,
  ...tagFilter
}

export interface JobGeneratorOptions {
  name: string
  /** whether to include in `nightly` workflow or just `tool-kit` */
  addToNightly: boolean
  requires: string[]
  /** other fields to include in the job */
  additionalFields?: JobConfig
}

/**
 * `generateConfigWithJob` generates a single job, structured so that it will
 * merge nicely with the rest of the config. This will include the `requires`
 * parameter, as well as the boilerplate properties from `jobBoilerplate`, but
 * any other options will need to be passed to `additionalFields`, such as
 * `filters.branches`.
 */
export const generateConfigWithJob = (options: JobGeneratorOptions): CircleCIStatePartial => {
  const config: CircleCIStatePartial = {
    workflows: {
      'tool-kit': {
        jobs: [
          {
            [options.name]: merge({ requires: options.requires }, jobBoilerplate, options.additionalFields)
          }
        ]
      }
    }
  }
  if (options.addToNightly) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.workflows!.nightly = {
      jobs: [
        {
          [options.name]: merge(
            { requires: options.requires.filter((job) => job !== 'waiting-for-approval') },
            nightlyBoilerplate,
            options.additionalFields
          )
        }
      ]
    }
  }
  return config
}

const getInitialState = (): CircleCIState => {
  const options = getOptions('@dotcom-tool-kit/circleci') ?? {}
  return {
    version: 2.1,
    orbs: {
      'tool-kit': process.env.TOOL_KIT_FORCE_DEV_ORB
        ? 'financial-times/dotcom-tool-kit@dev:alpha'
        : `financial-times/dotcom-tool-kit@${majorOrbVersion}`
    },
    executors: {
      node: {
        docker: [{ image: `cimg/node:${options.nodeVersion ?? '16.14-browsers'}` }]
      }
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
          { checkout: tagFilter },
          {
            'waiting-for-approval': {
              type: 'approval',
              filters: { branches: { only: '/(^renovate-.*|^nori/.*)/' } }
            }
          },
          {
            'tool-kit/setup': {
              requires: ['checkout', 'waiting-for-approval'],
              ...jobBoilerplate
            }
          }
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
          {
            'tool-kit/setup': {
              requires: ['checkout'],
              ...nightlyBoilerplate
            }
          }
        ]
      }
    }
  }
}

const isAutomatedConfig = (config: string): boolean => config.startsWith(automatedComment)

const isNotToolKitConfig = (config: string): boolean => !config.includes('tool-kit')

const getJobName = (job: Job): string => (typeof job === 'string' ? job : Object.keys(job)[0])

const hasJob = (expectedJob: string, jobs: NonNullable<Workflow['jobs']>): boolean =>
  jobs.some(
    (job) =>
      (typeof job === 'string' && job === expectedJob) ||
      (typeof job === 'object' && job.hasOwnProperty(expectedJob))
  )

export default abstract class CircleCiConfigHook extends Hook<CircleCIState> {
  installGroup = 'circleci'

  circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  _circleConfig?: string
  haveCheckedBaseConfig = false
  _versionTag?: string
  abstract config: CircleCIStatePartial

  async getCircleConfig(): Promise<string | undefined> {
    if (!this._circleConfig) {
      try {
        this.logger.verbose(`trying to read CircleCI config at ${styles.filepath(this.circleConfigPath)}...`)
        this._circleConfig = await fs.readFile(this.circleConfigPath, 'utf8')
      } catch (err) {
        // Not an error if config file doesn't exist
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw err
        }
      }
    }

    return this._circleConfig
  }

  async check(): Promise<boolean> {
    const rawConfig = await this.getCircleConfig()
    if (!rawConfig) {
      return false
    }
    const config = YAML.parse(rawConfig) as CircleConfig

    // Automatically update tool kit orb if config is autogenerated
    if (isAutomatedConfig(rawConfig)) {
      const currentOrb = config?.orbs['tool-kit']
      const currentMajorTag = currentOrb && currentOrb.split('@')[1].split('.')[0]

      if (majorOrbVersion !== currentMajorTag) {
        return false
      }
    }

    // only need to check that the base config matches once
    if (!this.haveCheckedBaseConfig && !isMatch(config, getInitialState())) {
      return false
    }
    this.haveCheckedBaseConfig = true
    return isMatch(config, this.config)
  }

  async install(state?: CircleCIState): Promise<CircleCIState> {
    if (!state) {
      state = getInitialState()
    }
    // define a customiser function to make sure only jobs that aren't already
    // listed are merged into the CircleCI config, and to force new jobs to be
    // concatenated onto the array of other jobs rather than zipping them
    // (i.e., overwriting the first few jobs in the array)
    mergeWith(state, this.config, (prevState, newConfig, key) => {
      if (key === 'jobs' && Array.isArray(prevState)) {
        const uniqueJobs = newConfig.filter((job: Job) => !hasJob(getJobName(job), prevState))
        return prevState.concat(uniqueJobs)
      }
    })
    return state
  }

  async commitInstall(state: CircleCIState): Promise<void> {
    const rawConfig = await this.getCircleConfig()

    if (rawConfig && isNotToolKitConfig(rawConfig)) {
      throw new ToolKitError(
        `Your project has an existing CircleCI config file which doesn't contain a ${styles.heading(
          'tool-kit'
        )} workflow.
If you would like a Tool Kit configured CircleCI config file to be generated for you please delete your existing CircleCI ${styles.filepath(
          'config.yml'
        )} and re-run: ${styles.code('npx dotcom-tool-kit --install')}`
      )
    }

    const stringifyConfig = (config: CircleConfig) => YAML.stringify(config, { aliasDuplicateObjects: false })

    if (rawConfig && !isAutomatedConfig(rawConfig)) {
      const config = YAML.parse(rawConfig)
      // Don't include any fields that are in the user's config but not in our
      // expected config. The expected config is a subset of whatever config
      // the user chooses, and additional fields shouldn't be flagged in the
      // error.
      // I'm shocked that this isn't a lodash function.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const removeExtraFields = (expected: Record<string, any>, received: Record<string, any>) => {
        for (const [rk, rv] of Object.entries(received)) {
          if (!expected.hasOwnProperty(rk)) {
            delete received[rk]
            continue
          }
          if (isPlainObject(rv)) {
            removeExtraFields(expected[rk], rv)
          }
        }
      }
      removeExtraFields(state, config)
      const difference = diffStringsUnified(stringifyConfig(state), stringifyConfig(config), {
        expand: false
      })
      throw new ToolKitError(
        `Your CircleCI configuration is missing the expected fields from Tool Kit:\n${difference}`
      )
    }

    const serialised = automatedComment + stringifyConfig(state)
    const circleConfigDir = path.dirname(this.circleConfigPath)
    this.logger.verbose(`making directory at ${styles.filepath(circleConfigDir)}...`)
    // Enable recursive option so that mkdir doesn't throw if the directory
    // already exists.
    await fs.mkdir(circleConfigDir, { recursive: true })
    this.logger.info(`writing CircleCI config to ${styles.filepath(this.circleConfigPath)}...`)
    await fs.writeFile(this.circleConfigPath, serialised)
  }
}
