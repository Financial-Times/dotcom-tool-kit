import { readState } from '@dotcom-tool-kit/state'

export default async function(envVars:string[]) {
    let circlevariables: {[index: string]:any} = {}

    envVars.forEach(envVar => {
        circlevariables[envVar] = readState('ci', envVar)
    })

    return circlevariables
}