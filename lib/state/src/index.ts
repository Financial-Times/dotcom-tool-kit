import path from 'path'
import * as fs from 'fs'

const target = process.env.INIT_CWD || process.cwd()
const stateDir = target ? path.join(target, '/.toolkitstate') : '.toolkitstate'

interface CIState {
  repo: string
  branch: string
  version: string,
  tag: string
}

export interface ReviewState {
  appId: string
  appName: string
}

interface StagingState {
  appName: string
  slugId: string
  appIds: string[]
}

interface ProductionState {
  appIds: string[]
}

interface LocalState {
  port: number
}

export interface State {
  ci: CIState
  review: ReviewState
  staging: StagingState
  production: ProductionState
  local: LocalState
}

export function readState<T extends keyof State>(stage: T): State[T] | null {
  if (fs.existsSync(stateDir)) {
    const fileName = `${stage}.json`
    const filePath = path.join(stateDir, fileName)
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))
    }
  }
  return null
}

export function writeState<T extends keyof State>(stage: T, value: Partial<State[T]>): State[T] | null {
  const fileName = `${stage}.json`
  const filePath = path.join(stateDir, fileName)
  let readStateContent
  if (fs.existsSync(stateDir)) {
    if (fs.existsSync(filePath)) {
      readStateContent = Object.assign(
        JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' })),
        value
      )
    }
  } else {
    fs.mkdirSync(stateDir)
  }
  fs.writeFileSync(filePath, JSON.stringify(readStateContent || value, null, 2))
  return readState(stage)
}
