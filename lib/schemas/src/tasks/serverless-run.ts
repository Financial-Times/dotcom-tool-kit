import { z } from 'zod'

export const ServerlessRunSchema = z
  .object({
    ports: z
      .number()
      .array()
      .default([3001, 3002, 3003])
      .describe('ports to try to bind to for this application'),
    useDoppler: z
      .boolean()
      .default(true)
      .describe('run the application with environment variables from Doppler')
  })
  .describe('Run serverless functions locally')

export type ServerlessRunOptions = z.infer<typeof ServerlessRunSchema>

export const Schema = ServerlessRunSchema
