import { z } from 'zod'

export const VaultSchema = z.object({
  team: z.string(),
  app: z.string()
})
export type VaultOptions = z.infer<typeof VaultSchema>

export const Schema = VaultSchema
