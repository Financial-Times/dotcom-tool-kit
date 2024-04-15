import { z } from 'zod'

export const CircleCiExecutor = z.object({
  name: z.string(),
  image: z.string()
})
export type CircleCiExecutor = z.infer<typeof CircleCiExecutor>

export const CircleCiJob = z.object({
  name: z.string(),
  command: z.string()
})
export type CircleCiJob = z.infer<typeof CircleCiJob>

export const CircleCiWorkflowJob = z.object({
  name: z.string(),
  requires: z.array(z.string()),
  splitIntoMatrix: z.boolean().optional(),
  custom: z.unknown().optional()
})
export type CircleCiWorkflowJob = z.infer<typeof CircleCiWorkflowJob>

export const CircleCiWorkflow = z.object({
  name: z.string(),
  jobs: z.array(CircleCiWorkflowJob),
  runOnRelease: z.boolean().optional(),
  custom: z.unknown().optional()
})
export type CircleCiWorkflow = z.infer<typeof CircleCiWorkflow>

export const CircleCiCustomConfig = z.record(z.unknown())
export type CircleCiCustomConfig = z.infer<typeof CircleCiCustomConfig>

export const CircleCiSchema = z.object({
  executors: z.array(CircleCiExecutor).optional(),
  jobs: z.array(CircleCiJob).optional(),
  workflows: z.array(CircleCiWorkflow).optional(),
  custom: CircleCiCustomConfig.optional(),
  disableBaseConfig: z.boolean().optional()
})

export type CircleCiOptions = z.infer<typeof CircleCiSchema>

export const Schema = CircleCiSchema
