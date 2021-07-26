import { request } from '@octokit/request'
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

export default async function getRepoDetails(): Promise<repoDetails> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('Could not find CI state')
  }

  const { branch, repo, version } = state

  console.log(`Retrieving tarball url from Github...`)
  const res = await request(`GET /repos/Financial-Times/${repo}/tarball/${branch}`, {
    headers: {
      authorization: githubAuthToken
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
}
