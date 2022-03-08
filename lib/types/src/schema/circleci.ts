export type JobConfig = {
    requires?: string[]
    filters?: { branches?: { only?: string; ignore?: string }, tags?: { only?: string} }
}

type TriggerConfig = {
    schedule?: { cron: string; filters?: { branches: { only?: string; ignore?: string } } }
}

export type Workflow = {
    jobs?: (string | { [job: string]: JobConfig })[]
    triggers?: (string | { [trigger: string]: TriggerConfig })[]
}

export interface CircleConfig {
    version: number
    orbs: { [orb: string]: string }
    workflows?: {
      version: number
      [workflow: string]: Workflow | number
    }
}