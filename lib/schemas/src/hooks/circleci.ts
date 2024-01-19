import { z } from 'zod'

export const CircleCiExecutor = z.object({
  name: z.string(),
  image: z.string(),
  appliedJobs: z.array(z.string())
})
export const CircleCiJob = z.object({
  name: z.string(),
  command: z.string(),
  requires: z.array(z.string()),
  runOnce: z.boolean().default(false),
  custom: z.unknown().optional()
})
export const CircleCiWorkflow = z.object({
  name: z.string(),
  jobs: z.array(z.string())
})
export const CircleCiCustomConfig = z.record(z.unknown())
export const CircleCiSchema = z.object({
  executors: z.array(CircleCiExecutor).optional(),
  jobs: z.array(CircleCiJob).optional(),
  workflows: z.array(CircleCiWorkflow).optional(),
  custom: CircleCiCustomConfig.optional()
})

export type CircleCiOptions = z.infer<typeof CircleCiSchema>

export const Schema = CircleCiSchema
