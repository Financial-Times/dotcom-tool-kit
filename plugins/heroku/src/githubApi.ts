import { request } from '@octokit/request'
import { RequestError } from '@octokit/request-error'
import { type Logger } from 'winston'

import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

const githubAuthToken = process.env.GITHUB_AUTH_TOKEN

export type repoDetails = {
  repo: string
  branch: string
  source_blob: {
    url: string
    version: string
  }
}

async function getRepoDetails(logger: Logger): Promise<repoDetails> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('Could not find CI state')
  }

  const { branch, repo, version } = state

  logger.info(`Retrieving tarball url from Github...`)
  try {
    const res = await request(`GET /repos/Financial-Times/${repo}/tarball/${version}`, {
      headers: {
        authorization: `token ${githubAuthToken}`
      },
      request: {
        redirect: 'manual'
      }
    })

    if (res.status !== 302 || !res.headers.location) {
      throw new ToolKitError(`Error retreiving repo details from Github`)
    }

    return {
      repo,
      branch,
      source_blob: {
        url: res.headers.location,
        version
      }
    }
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) {
      const error = new ToolKitError(`Error retreiving branch tarball from ${err.request.url}`)
      error.details = `This could be because you don't have process.env.GITHUB_AUTH_TOKEN set or it's expired`
      throw error
    }
    throw err
  }
}

export { getRepoDetails }
