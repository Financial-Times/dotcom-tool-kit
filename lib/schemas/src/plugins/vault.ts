import { z } from 'zod'

// In theory, these fields should be required as Vault won't work without them,
// but not every app that pulls in the Vault plugin actually needs to use
// Vault, e.g., an app that uses the `nodemon` plugin with the `useVault`
// option set to false.
export const VaultSchema = z
  .object({
    team: z.string(),
    app: z.string()
  })
  .partial()
export type VaultOptions = z.infer<typeof VaultSchema>

export const Schema = VaultSchema
