import type {
  CircleCiOptions,
  CircleCiSchema,
  CircleCiWorkflow
} from '@dotcom-tool-kit/schemas/lib/hooks/circleci'
import { type Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import { Hook, type HookInstallation } from '@dotcom-tool-kit/base'
import { type Plugin } from '@dotcom-tool-kit/plugin'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { getOptions } from '@dotcom-tool-kit/options'
import { promises as fs } from 'fs'
import { diffStringsUnified } from 'jest-diff'
import groupBy from 'lodash/groupBy'
import isPlainObject from 'lodash/isPlainObject'
import isMatch from 'lodash/isMatch'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import path from 'path'
import partition from 'lodash/partition'
import type { PartialDeep } from 'type-fest'
import YAML from 'yaml'

const automatedComment = '# CONFIG GENERATED BY DOTCOM-TOOL-KIT, DO NOT EDIT BY HAND\n'

type JobConfig = {
  type?: string
  docker?: { image: string; environment?: Record<string, string> }[]
  context?: string | string[]
  requires?: string[]
  filters?: { branches?: { only?: string; ignore?: string }; tags?: { only?: string } }
  executor?: string
  [parameter: string]: unknown
}

type Step = Record<string, string | string[]>

type Job = string | { [job: string]: JobConfig }

// TODO:20240410:IM rethink this whole type, it's very fly-by-night at the
// moment and constantly requires updates whenever we change the code
interface CircleConfig {
  version: 2.1
  orbs: {
    [orb: string]: string
  }
  executors: {
    [executor: string]: {
      docker: { image: string }[]
    }
  }
  jobs: {
    [job: string]: {
      docker?: { image: string }[]
      executor?: string
      parameters?: unknown
      steps: (string | { [command: string]: Step })[]
    }
  }
  workflows: {
    [workflow: string]: {
      when: unknown
      jobs: Job[]
    }
  }
}

const MAJOR_ORB_VERSION = '5'

export type CircleCIState = CircleConfig
/**
 * CircleCIStatePartial makes every property in the config object optional,
 * including nested properties. This is particularly useful as we merge each
 * hook's config into the larger state, and so each hook only needs to define
 * the parts of the config they want to add to.
 */
export type CircleCIStatePartial = PartialDeep<CircleCIState>

// Make this function lazy so that the global options object will have been
// populated first.
const getNodeVersions = (): Array<string> => {
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
   * Tool Kit will try and parse options for every plugin it loads which has a
   * schema. If we're running this code the @dotcom-tool-kit/circleci has by
   * definition been loaded, and there is a schema associated with it. So the
   * option field will be guaranteed to be present.
   **/
  return getOptions('@dotcom-tool-kit/circleci')!.cimgNodeVersions
}

/* Applies a verion identifier for all but the first (and therefore default)
 * Node executor, sanitising the Node version to be suitable for a CircleCI
 * configuration name. */
const nodeVersionToExecutor = (version: string, index: number): string =>
  index === 0 ? 'node' : `node${version.replaceAll('.', '_')}`

const matrixBoilerplate = (jobName: string) => ({
  name: `${jobName}-<< matrix.executor >>`,
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
export const tagFilter = { filters: { tags: { only: `${/^v\d+\.\d+\.\d+(-.+)?/}` } } }

// helper override to the Lodash mergeWith function with a pre-defined
// customiser that will concatenate arrays rather than overriding them by index
const mergeWithConcatenatedArrays = (arg0: unknown, ...args: unknown[]) =>
  mergeWith(arg0, ...args, (obj: unknown, source: unknown) => {
    if (Array.isArray(obj)) {
      return obj.concat(source)
    }
  })

const getBaseConfig = (): CircleCIState => {
  const runsOnMultipleNodeVersions = getNodeVersions().length > 1
  const setupMatrix = runsOnMultipleNodeVersions ? matrixBoilerplate('tool-kit/setup') : { executor: 'node' }
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
            'tool-kit/setup': {
              ...setupMatrix,
              requires: ['checkout'],
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
        jobs: ['checkout', { 'tool-kit/setup': { ...setupMatrix, requires: ['checkout'] } }]
      }
    }
  }
}

const rootOptionKeys = ['executors', 'jobs', 'workflows'] as const satisfies readonly (keyof Omit<
  CircleCiOptions,
  'custom'
>)[]

const isAutomatedConfig = (config: string): boolean => config.startsWith(automatedComment)

const isNotToolKitConfig = (config: string): boolean => !config.includes('tool-kit')

const isObject = (val: unknown): val is Record<string, unknown> => isPlainObject(val)

const customOptionsOverlap = (
  installation: Record<string, unknown>,
  other: Record<string, unknown>
): boolean =>
  Object.entries(installation).some(([key, value]) => {
    if (key in other) {
      const otherVal = other[key]
      if (isObject(value) && isObject(otherVal)) {
        return customOptionsOverlap(value, otherVal)
      } else if (Array.isArray(value) && Array.isArray(otherVal)) {
        return false
      } else {
        return value !== otherVal
      }
    } else {
      return false
    }
  })

const rootOptionOverlaps = (root: { name: string }[], other: { name: string }[]): boolean => {
  const otherNames = other.map(({ name }) => name)
  return root.map(({ name }) => name).some((name) => otherNames.includes(name))
}

const installationsOverlap = (
  installation: HookInstallation<CircleCiOptions>,
  other: HookInstallation<CircleCiOptions>
): boolean =>
  customOptionsOverlap(installation.options?.custom ?? {}, other.options?.custom ?? {}) ||
  rootOptionKeys.some((rootOption) =>
    rootOptionOverlaps(installation.options?.[rootOption] ?? [], other.options?.[rootOption] ?? [])
  )

// classify installation as either mergeable or unmergeable, and mark any other
// installations that overlap with it as now unmergeable
const partitionInstallations = (
  installation: HookInstallation<CircleCiOptions>,
  currentlyMergeable: HookInstallation<CircleCiOptions>[],
  currentlyUnmergeable: HookInstallation<CircleCiOptions>[]
): [HookInstallation<CircleCiOptions>[], HookInstallation<CircleCiOptions>[]] => {
  const [noLongerMergeable, mergeable] = partition(currentlyMergeable, (other) =>
    installationsOverlap(installation, other)
  )
  const unmergeable = currentlyUnmergeable.concat(noLongerMergeable)

  const overlapsWithUnmergeable = currentlyUnmergeable.some((other) =>
    installationsOverlap(installation, other)
  )
  if (noLongerMergeable.length > 0 || overlapsWithUnmergeable) {
    unmergeable.push(installation)
  } else {
    mergeable.push(installation)
  }

  return [mergeable, unmergeable]
}

// find any items with the same value in their 'name' field and merge those
// together
const mergeRootOptions = <T extends { name: string }>(options: T[]): T[] =>
  Object.values(groupBy(options, 'name')).map((matching) => mergeWithConcatenatedArrays({}, ...matching))

const mergeInstallations = (installations: HookInstallation<CircleCiOptions>[]): CircleCiOptions => ({
  // merge each of the root options ('executors', 'jobs', 'workflows') using
  // their 'name' keys
  ...Object.fromEntries(
    rootOptionKeys.map((rootKey) => {
      // flatten each installation's options into a single array (the order of
      // the installations in the array is maintained)
      const rootOptions = installations.flatMap<{ name: string }>(
        (installation) => installation.options[rootKey] ?? []
      )
      return [rootKey, mergeRootOptions(rootOptions)]
    })
  ),
  // squash all the custom options together
  custom: mergeWithConcatenatedArrays({}, ...installations.map((installation) => installation.options.custom))
})

const mergeInstallationResults = (
  plugin: Plugin,
  mergeable: HookInstallation<CircleCiOptions>[],
  unmergeable: HookInstallation<CircleCiOptions>[]
) => {
  const results: (HookInstallation<CircleCiOptions> | Conflict<HookInstallation>)[] = []

  if (mergeable.length > 0) {
    results.push({
      plugin,
      forHook: 'CircleCi',
      hookConstructor: CircleCi,
      options: mergeInstallations(mergeable)
    })
  }

  if (unmergeable.length > 0) {
    results.push({
      plugin,
      conflicting: unmergeable
    })
  }

  return results
}

const toolKitOrbPrefix = (job: string) => `tool-kit/${job}`

const generateJobs = (workflow: CircleCiWorkflow): Job[] => {
  const runsOnMultipleNodeVersions = getNodeVersions().length > 1
  return workflow.jobs.map((job) => {
    const splitIntoMatrix = runsOnMultipleNodeVersions && (job.splitIntoMatrix ?? true)
    return {
      [toolKitOrbPrefix(job.name)]: merge(
        splitIntoMatrix
          ? matrixBoilerplate(toolKitOrbPrefix(job.name))
          : {
              executor: 'node'
            },
        {
          requires: job.requires.map((required) => {
            if (required === 'checkout') {
              return required
            }
            const requiredOrb = toolKitOrbPrefix(required)
            // only need to include a suffix for the required job if it splits
            // into a matrix for Node versions
            const splitRequiredIntoMatrix =
              runsOnMultipleNodeVersions &&
              (workflow.jobs?.find(({ name: jobName }) => required === jobName)?.splitIntoMatrix ?? true)
            if (!splitRequiredIntoMatrix) {
              return requiredOrb
            }
            return `${requiredOrb}-${splitIntoMatrix ? '<< matrix.executor >>' : 'node'}`
          })
        },
        workflow.runOnRelease ? tagFilter : {},
        job.custom
      )
    }
  })
}

export default class CircleCi extends Hook<typeof CircleCiSchema, CircleCIState> {
  circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  private circleConfig?: string
  private generatedConfig?: CircleCIState

  async getCircleConfig(): Promise<string | undefined> {
    if (!this.circleConfig) {
      try {
        this.logger.verbose(`trying to read CircleCI config at ${styles.filepath(this.circleConfigPath)}...`)
        this.circleConfig = await fs.readFile(this.circleConfigPath, 'utf8')
      } catch (err) {
        // Not an error if config file doesn't exist
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw err
        }
      }
    }

    return this.circleConfig
  }

  static mergeChildInstallations(
    plugin: Plugin,
    childInstallations: (HookInstallation<CircleCiOptions> | Conflict<HookInstallation<CircleCiOptions>>)[]
  ): (HookInstallation<CircleCiOptions> | Conflict<HookInstallation>)[] {
    const [mergeable, unmergeable] = childInstallations.reduce<
      [HookInstallation<CircleCiOptions>[], HookInstallation<CircleCiOptions>[]]
    >(
      ([mergeable, unmergeable], installation) => {
        // a conflicting installation is marked as unmergeable without
        // affecting the mergeability of the other installations
        if (isConflict(installation)) {
          return [mergeable, [...unmergeable, ...installation.conflicting]]
        } else {
          return partitionInstallations(installation, mergeable, unmergeable)
        }
      },
      [[], []]
    )

    return mergeInstallationResults(plugin, mergeable, unmergeable)
  }

  static overrideChildInstallations(
    plugin: Plugin,
    parentInstallation: HookInstallation<CircleCiOptions>,
    childInstallations: (HookInstallation<CircleCiOptions> | Conflict<HookInstallation<CircleCiOptions>>)[]
  ): (HookInstallation<CircleCiOptions> | Conflict<HookInstallation<CircleCiOptions>>)[] {
    const mergeable: HookInstallation<CircleCiOptions>[] = []
    const unmergeable: HookInstallation<CircleCiOptions>[] = []

    for (const installation of childInstallations) {
      // TODO:IM there are multiple kinds of conflicts and this code currently
      // assumes a parent resolving one conflict resolves them all
      if (isConflict(installation)) {
        const [canHandle, cannotHandle] = partition(installation.conflicting, (other) =>
          installationsOverlap(parentInstallation, other)
        )

        mergeable.push(...canHandle)
        unmergeable.push(...cannotHandle)
      } else {
        mergeable.push(installation)
      }
    }

    mergeable.push(parentInstallation)

    return mergeInstallationResults(plugin, mergeable, unmergeable)
  }

  generateConfig(): CircleCIState {
    if (!this.generatedConfig) {
      const generated: CircleCIStatePartial = {}
      if (this.options.executors) {
        generated.executors = Object.fromEntries(
          this.options.executors.map((executor) => [executor.name, { docker: [{ image: executor.image }] }])
        )
      }
      if (this.options.workflows) {
        generated.workflows = Object.fromEntries(
          this.options.workflows.map((workflow) => {
            const generatedJobs = {
              jobs: generateJobs(workflow)
            }
            return [workflow.name, mergeWithConcatenatedArrays(generatedJobs, workflow.custom)]
          })
        )
      }
      this.generatedConfig = mergeWithConcatenatedArrays(
        {},
        this.options.disableBaseConfig ? {} : getBaseConfig(),
        generated,
        this.options.custom ?? {}
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.generatedConfig!
  }

  async isInstalled(): Promise<boolean> {
    const rawConfig = await this.getCircleConfig()
    if (!rawConfig) {
      return false
    }
    const config = YAML.parse(rawConfig) as CircleConfig

    const expectedConfig = this.generateConfig()
    return isMatch(config, expectedConfig)
  }

  async install(): Promise<CircleCIState> {
    return this.generateConfig()
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
