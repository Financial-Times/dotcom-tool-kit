import { z } from 'zod'

export const ServerlessRunSchema = z.object({
  ports: z.number().array().default([3001, 3002, 3003]),
  useDoppler: z.boolean().default(true)
})

export type ServerlessRunOptions = z.infer<typeof ServerlessRunSchema>

export const Schema = ServerlessRunSchema
