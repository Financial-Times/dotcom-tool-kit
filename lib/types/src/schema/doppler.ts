import { z } from 'zod'

// In theory, these fields should be required as Doppler won't work without them,
// but not every app that pulls in the Doppler plugin actually needs to use
// Doppler, e.g., an app that uses the `nodemon` plugin with the `useDoppler`
// option set to false.
export const DopplerSchema = z
  .object({
    project: z.string()
  })
  .partial()
export type DopplerOptions = z.infer<typeof DopplerSchema>

export const Schema = DopplerSchema
