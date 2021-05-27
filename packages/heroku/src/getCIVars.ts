import { readState } from '@dotcom-tool-kit/state'

export default async function(envVars:string[]) {
    let ciVars: {[index: string]:any} = {}

    envVars.forEach(envVar => {
        ciVars[envVar] = readState('ci', envVar)
    })

    return ciVars
}