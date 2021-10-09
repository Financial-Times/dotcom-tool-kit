import { describe, it, expect, jest } from '@jest/globals'
import { getPipelineCouplings } from '../src/getPipelineCouplings'
import heroku from '../src/herokuClient'

type State = {
  [key: string]: string[]
}

type Pipeline = {
  [key: string]: {
    id: string
  }
}

const state: State = {}

const pipeline: Pipeline = {
  'test-pipeline-name': {
    id: '123'
  }
}

const couplings = [
  {
    app: {
      id: 'prod-appID'
    },
    stage: 'production'
  },
  {
    app: {
      id: 'staging-appID'
    },
    stage: 'staging'
  }
]

const pipelineName = 'test-pipeline-name'

jest.mock('../src/herokuClient', () => {
  return {
    get: jest.fn((str: string) => {
      return str.includes('couplings') ? couplings : pipeline[str.replace('/pipelines/', '')]
    })
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    writeState: jest.fn((stage: string, { appIds }) => {
      state[stage] = appIds
    })
  }
})

describe('getPipelineCouplings', () => {
  it('calls heroku api twice', async () => {
    await getPipelineCouplings(pipelineName)
    expect(heroku.get).toHaveBeenCalledTimes(2)
  })

  it('writes app ids to state', async () => {
    await getPipelineCouplings(pipelineName)
    const { production, staging } = state
    expect(production).toEqual(['prod-appID'])
    expect(staging).toEqual(['staging-appID'])
  })

  it('does not throw when successful', async () => {
    await expect(getPipelineCouplings(pipelineName)).resolves.not.toThrow()
  })

  it('throws when unsuccessful', async () => {
    const wrongPipelineName = 'wrong-test-pipeline-name'
    await expect(getPipelineCouplings(wrongPipelineName)).rejects.toThrowError()
  })
})
