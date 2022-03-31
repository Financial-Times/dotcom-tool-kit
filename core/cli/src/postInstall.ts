import path from 'path'
import { promises as fs } from 'fs'
import { semVerRegex } from '@dotcom-tool-kit/npm/lib/tasks/npm-publish'
import * as YAML from "yaml";
import { Pair, YAMLMap, YAMLSeq } from "yaml/types";
import merge from 'lodash.merge'
import type { Logger } from 'winston'
import { automatedComment, JobConfig } from '@dotcom-tool-kit/types/lib/circleci'

/**
 * This step adds the tags only filter to rest of the jobs in the workflow if there is a job that contains the semverRegex.
 * CircleCI will only run the jobs if the rest of the jobs have the tags filter. 
 */
export async function postInstall(logger: Logger): Promise<void> {
  const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  try {
    const rawCircleConfig = await fs.readFile(circleConfigPath, 'utf8')
    if (rawCircleConfig && rawCircleConfig.includes(semVerRegex.source) && rawCircleConfig.startsWith(automatedComment)) {
      logger.verbose('running postInstall step')
      const yml = YAML.parseDocument(rawCircleConfig)
      const workflows: YAMLMap = yml.get('workflows')
      const toolkitWorkflow = workflows.get('tool-kit')
      const jobs: YAMLSeq = toolkitWorkflow.get('jobs')
      jobs?.items.forEach((jobItem, index) => {
        const tagsFilterConfig: JobConfig = { filters : { tags: { only: `${semVerRegex}` }} }
        if(jobItem.type === 'PLAIN') { // eg. - checkout
          const node = YAML.createNode({[jobItem.value]: tagsFilterConfig})
          jobs.items[index] = node;
        } else {
          const job: Pair = (jobItem as YAMLMap).items[0]
          const existingFilter: Pair | undefined = job.value.items.filter((item: Pair) => item.key.value === 'filters')[0]
          const merged = existingFilter ? merge(existingFilter.toJSON(), tagsFilterConfig) : tagsFilterConfig
          const node = YAML.createNode(merged['filters'])
          job.value.set('filters', node);
        }
      })
      logger.info(`writing postInstall results to file ${circleConfigPath}`)
      await fs.writeFile(circleConfigPath, yml.toString())
    }
  } catch (error) {
    // Not an error if config file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}
