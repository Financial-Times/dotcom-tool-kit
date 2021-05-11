import State from './commands/state'
import * as fs from 'fs'

export const commands = {
  'state': State
}

export function readState(stage: string, item: string): string | null {
  if (fs.existsSync('.toolkitstate.json')) {
    const stateFile = JSON.parse(fs.readFileSync('.toolkitstate.json', {encoding: 'utf-8'}))
    try {
      return stateFile[stage][item]
    } catch {
      return null
    }
  } 
  return null
}

export function writeState(stage: string, item: string, value: string) {
  //if the stage exists in statefile; with or without the item
  if (fs.existsSync('.toolkitstate.json')) {
    const stateFile = JSON.parse(fs.readFileSync('.toolkitstate.json', {encoding: 'utf-8'}))
    if (stateFile[stage] || readState(stage, item)) {
      stateFile[stage][item] = value
    } else if (stateFile) {
      stateFile[stage] = {item : value}
    }
    fs.writeFileSync('.toolkitstate.json', JSON.stringify(stateFile, null, 2) )
  } else {
    const data = {stage: {item : value}}
    fs.appendFileSync('.toolkitstate.json', JSON.stringify(data, null, 2))
  }
}