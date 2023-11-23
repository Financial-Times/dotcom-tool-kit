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
import omit from 'lodash/omit'
import path from 'path'
import type { PartialDeep } from 'type-fest'
import YAML from 'yaml'
import { z } from 'zod'

const MAJOR_ORB_VERSION = '5'

export type CircleCIState = CircleConfig
/**
 * CircleCIStatePartial makes every property in the config object optional,
 * including nested properties. This is particularly useful as we merge each
 * hook's config into the larger state, and so each hook only needs to define
 * the parts of the config they want to add to.
 */
export type CircleCIStatePartial = PartialDeep<CircleCIState>

const getNodeVersions = (): Array<string> => {
  // HACK: This function should only ever be called after the Tool Kit options
  // are loaded so that we can see which node versions are specified. However,
  // older versions of the other CircleCI plugins may not do this properly, so
  // to avoid a breaking change we fall back to creating an array with a single
  // empty string. The first executor is named 'node' without any reference to
  // the version so the plugins which don't support matrices don't need to know
  // the version option.
  const nodeVersion = getOptions('@dotcom-tool-kit/circleci')?.nodeVersion ?? ''
  return Array.isArray(nodeVersion) ? nodeVersion : [nodeVersion]
}

/* Applies a verion identifier for all but the first (and therefore default)
 * Node executor, sanitising the Node version to be suitable for a CircleCI
 * configuration name. */
const nodeVersionToExecutor = (version: string, index: number): string =>
  index === 0 ? 'node' : `node${version.replaceAll('.', '_')}`

// These boilerplate objects are (typically) needed for each job. They can be
// spread into your custom config, and are automatically included when calling
// generateSimpleJob.

/**
 * Every Tool Kit job uses a Node executor. We define a list of possible Node
 * executors at the top of the CircleCI config, and jobs can either opt for the
 * default executor (shortened to just 'node') with `nightlyBoilerplate` or to
 * run with all the different executors in a matrix via `matrixBoilerplate`.
 * version of Node to use.
 */
export const nightlyBoilerplate = {
  executor: 'node'
}
// Needs to be lazy as the node versions haven't been loaded yet when this
// module is initialised.
export const matrixBoilerplate = () => ({
  matrix: {
    parameters: {
      executor: getNodeVersions().map(nodeVersionToExecutor)
    }
  }
})

/**
 * tagFilter sets the regex for GitHub release tags: CircleCI will ignore jobs
 * when doing a release if the filter isn't made explicit
 */
export const tagFilter = { filters: { tags: { only: `${semVerRegex}` } } }
/**
 * @deprecated explicitly using each of the objects this spreads is preferred.
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
  /** whether this job can be run multiple times with different Node versions */
  splitIntoMatrix: boolean
  skipOnRelease?: boolean
  /** other fields to include in the job */
  additionalFields?: JobConfig
}

/**
 * `generateConfigWithJob` generates a single job, structured so that it will
 * merge nicely with the rest of the config. This will include the `requires`
 * parameter, as well as the boilerplate properties from `matrixBoilerplate`,
 * but any other options will need to be passed to `additionalFields`, such as
 * `filters.branches`.
 */
export const generateConfigWithJob = (options: JobGeneratorOptions): CircleCIStatePartial => {
  const jobBase = options.splitIntoMatrix
    ? {
        name: `${options.name}-<< matrix.executor >>`,
        requires: options.requires.map((dep) =>
          dep === 'waiting-for-approval' ? dep : `${dep}-<< matrix.executor >>`
        ),
        ...matrixBoilerplate()
      }
    : {
        // only require the latest Node version of a matrix job in order to
        // avoid workspace conflicts
        requires: options.requires.map((dep) => (dep === 'waiting-for-approval' ? dep : `${dep}-node`)),
        // append the default executor name to the job name so that multiple
        // non-matrix jobs can be chained one after another without having to
        // know whether a matrix job precedes them or not
        name: `${options.name}-node`,
        ...nightlyBoilerplate
      }
  const config: CircleCIStatePartial = {
    workflows: {
      'tool-kit': {
        jobs: [
          {
            // avoid overwriting the jobBase variable
            [options.name]: merge(
              {},
              jobBase,
              options.skipOnRelease ? {} : tagFilter,
              options.additionalFields
            )
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
            { ...jobBase, requires: jobBase.requires.filter((dep) => dep !== 'waiting-for-approval') },
            omit(options.additionalFields, ['filters'])
          )
        }
      ]
    }
  }
  return config
}

const getInitialState = (): CircleCIState => {
  return {
    version: 2.1,
    orbs: {
      'tool-kit': process.env.TOOL_KIT_FORCE_DEV_ORB
        ? 'financial-times/dotcom-tool-kit@dev:alpha'
        : `financial-times/dotcom-tool-kit@${MAJOR_ORB_VERSION}`
    },
    executors: Object.fromEntries(
      getNodeVersions().map((version, i) => [
        nodeVersionToExecutor(version, i),
        {
          docker: [{ image: `cimg/node:${version}` }]
        }
      ])
    ),
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
              name: 'tool-kit/setup-<< matrix.executor >>',
              requires: ['checkout', 'waiting-for-approval'],
              ...matrixBoilerplate(),
              ...tagFilter
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
              name: 'tool-kit/setup-<< matrix.executor >>',
              requires: ['checkout'],
              ...matrixBoilerplate()
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

export default abstract class CircleCiConfigHook extends Hook<z.ZodTypeAny, CircleCIState> {
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
