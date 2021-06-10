import * as fs from 'fs'
const target = process.env.INIT_CWD
const stateFile = target ? `${target}/.toolkitstate.json` : '.toolkitstate.json'

export function readState<T>(
  stage: T,
  items: string[]
): { [index: string]: string | number | boolean } | null {
  const stateResults: { [index: string]: string | number } = {}
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, { encoding: 'utf-8' }))
    items.forEach((item) => {
      try {
        stateResults[item] = readStateContent[stage][item]
      } catch {
        return null
      }
    })
    return stateResults
  }
  return null
}

export function writeState<T>(
  stage: string,
  item: string,
  value: T
): { [index: string]: string | number | boolean } | null {
  if (fs.existsSync(stateFile)) {
    const readStateContent = JSON.parse(fs.readFileSync(stateFile, { encoding: 'utf-8' }))
    if (readStateContent[stage]) {
      readStateContent[stage][item] = value
    } else {
      readStateContent[stage] = { item: value }
    }
    fs.writeFileSync(stateFile, JSON.stringify(readStateContent, null, 2))
  } else {
    const data = {
      [stage]: {
        [item]: value
      }
    }
    fs.writeFileSync(stateFile, JSON.stringify(data, null, 2))
  }
  return readState(stage, [item])
}
