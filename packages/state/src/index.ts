import State from './commands/state'
import * as fs from 'fs'

export const commands = {
  'state': State
}

const stateFile = JSON.parse(fs.readFileSync('stat.json', {encoding: 'utf-8'}))

export function readState(stage: string, item: string): string | null {
  try {
    return stateFile[stage][item]
  } catch {
    return null
  }    
}

export function writeState(stage: string, item: string, value: string) {
  // if the stage exists in statefile; with or without the item
  if (stateFile[stage] || readState(stage, item)) {
    stateFile[stage][item] = value
  // } else if (stateFile[stage] && !readState(stage, item)) {
  //   stateFile[stage][item] = value
  // if the file exists
  } else if (stateFile) {
    stateFile[stage] = {item : value}
  } else {
    console.log(`here`)
    fs.appendFile('stat.json', JSON.stringify({"test": 1}, null, 2), (err) => {
      if (err) throw new Error (`errored: ${err}`)
      console.log(`new state file created`)
    })
  }
  fs.writeFileSync('stat.json', JSON.stringify(stateFile, null, 2) )
}