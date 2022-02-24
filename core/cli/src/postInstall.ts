import path from 'path'
import { promises as fs } from 'fs'
import { semVerRegex } from '@dotcom-tool-kit/npm/lib/tasks/npm-publish'
import * as yaml from 'js-yaml'
import { CircleConfig, Workflow, JobConfig } from '@dotcom-tool-kit/circleci/lib/circleci-config'
import { merge } from 'lodash'
import type { Logger } from 'winston'

/**
 * This step adds the tags only filter to rest of the jobs in the workflow if there is a job that contains the semverRegex.
 * CircleCI will only run the jobs if the rest of the jobs have the tags filter. 
 */
export async function postInstall(logger: Logger) {
  const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
  const rawCircleConfig = await fs.readFile(circleConfigPath, 'utf8')
  if (rawCircleConfig && rawCircleConfig.includes(semVerRegex.source)) {
    logger.info('running postInstall step')
    const circleConfig: CircleConfig = yaml.load(rawCircleConfig) as CircleConfig
    const jobs = (circleConfig.workflows as Record<string, Workflow>)?.['tool-kit']?.jobs
    jobs?.forEach((job, index) => {
      const tagsFilterConfig: JobConfig = { filters : { tags: { only: `${semVerRegex}` }} }
      if(typeof job === "string") {
        jobs[index] = {[job]: tagsFilterConfig }
      } else {
        Object.entries(job).forEach(([key, value]) => {
          job[key] = merge(value, tagsFilterConfig)
        })
      }
    })
    logger.info(`writing postInstall results to file ${circleConfigPath}`)
    await fs.writeFile(circleConfigPath, yaml.dump(circleConfig))
  }
}
