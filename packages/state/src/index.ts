import * as fs from 'fs'

const stateFile = '.toolkitstate.json'

export function readState(stage: string, item: string): string | null {
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, {encoding: 'utf-8'}))
    try {
      return readStateContent[stage][item]
    } catch {
      return null
    }
  } 
  return null
}

export function writeState(stage: string, item: string, value: string) {
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, {encoding: 'utf-8'}))
    if (readStateContent[stage]) {
      readStateContent[stage][item] = value
    } else {
      readStateContent[stage] = {[item] : value}
    }
    fs.writeFileSync(stateFile, JSON.stringify(readState, null, 2) )
  } else {
    const data = {
        [stage]: {
          [item] : value
        }
      }
    fs.appendFileSync(stateFile, JSON.stringify(data, null, 2))
  }
}