import { z } from 'zod'

export const ParallelSchema = z
  .object({
    tasks: z.array(z.record(z.unknown()))
  })
  .describe('Run Tool Kit tasks in parallel')

export type ParallelOptions = z.infer<typeof ParallelSchema>

export const Schema = ParallelSchema
