import { writeState } from '@dotcom-tool-kit/state/lib'
import { describe, it, expect, jest } from '@jest/globals'
import { writeLatestReleaseDetails } from '../src/writeLatestReleaseDetails'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const stagingAppName = 'staging-app-name'
const version = 'match-version-commit-id'

const latest = {
  id: 'release-id-2'
}

const releases = [
  {
    current: false,
    slug: {
      id: 'slug-id-1'
    },
    id: 'release-id-1',
    status: 'succeeded'
  },
  {
    current: true,
    slug: {
      id: 'slug-id-2'
    },
    id: 'release-id-2',
    status: 'succeeded'
  }
]

const slugDetailsMatch = {
  id: 'slug-id-2',
  commit: 'match-version-commit-id'
}

jest.mock('../src/herokuClient', () => {
  return {
    get: jest.fn((str: string) => {
      return str.includes('/staging-app-name/releases') ? releases : slugDetailsMatch
    })
  }
})

jest.mock('../src/./checkIfStagingUpdated', async () => {
  return {
    checkIfStagingUpdated: jest.fn((appName: string, releaseId: string) => {
      if (appName === stagingAppName && releaseId === latest.id) {
        Promise.resolve()
      } else {
        Promise.reject()
      }
    })
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    writeState: jest.fn()
  }
})

describe('writeLatestResleaseDetails', () => {
  it(`throws when it can't find a latest release`, async () => {
    await expect(writeLatestReleaseDetails(logger, 'randon-app-name', version)).rejects.toThrow()
  })

  it('writes slug id to state file', async () => {
    await writeLatestReleaseDetails(logger, stagingAppName, version)

    expect(writeState).toBeCalledWith('staging', { slugId: 'slug-id-2' })
  })

  it('throws when staging does not update to the latest commit', async () => {
    await expect(
      writeLatestReleaseDetails(logger, stagingAppName, 'never-match-version-commit-id')
    ).rejects.toThrow()
  })

  it('returns without throwing when successful', async () => {
    await expect(writeLatestReleaseDetails(logger, stagingAppName, version)).resolves.not.toThrow()
  })
})
