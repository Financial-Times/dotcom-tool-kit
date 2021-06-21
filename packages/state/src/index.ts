import * as fs from 'fs'
const target = process.env.INIT_CWD
const stateFile = target ? `${target}/.toolkitstate.json` : '.toolkitstate.json'

interface CIState {
  repo: string
  branch: string
  version: string
}

interface ReviewState {
  appId: string
  appName: string
}

interface StagingState {
  appName: string
}

interface ProductionState {
  appName: string
}

interface State {
  ci: CIState
  review: ReviewState
  staging: StagingState
  production: ProductionState
}

export function readState<T extends keyof State>(stage: T): State[T] | null {
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, { encoding: 'utf-8' }))
    try {
      return readStateContent[stage]
    } catch {
      return null
    }
  }
  return null
}

export function writeState<T extends keyof State>(stage: T, value: Partial<State[T]>): State[T] | null {
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, { encoding: 'utf-8' }))
    for (const [key, val] of Object.entries(value)) {
      readStateContent[stage][key] = val
    }
    fs.writeFileSync(stateFile, JSON.stringify(readStateContent, null, 2))
  } else {
    const data = {
      [stage]: value
    }
    fs.writeFileSync(stateFile, JSON.stringify(data, null, 2))
  }
  return readState(stage)
}
