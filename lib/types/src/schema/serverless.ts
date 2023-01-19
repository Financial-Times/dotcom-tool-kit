import { z } from 'zod'

export const ServerlessSchema = z.object({
  configPath: z.string().optional(),
  useVault: z.boolean().optional(),
  ports: z.number().array().optional()
})
export type ServerlessOptions = z.infer<typeof ServerlessSchema>

export const Schema = ServerlessSchema
