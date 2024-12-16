import { z } from 'zod'

export const CloudsmithSchema = z.object({
  serviceAccount: z
    .string()
    .optional()
    .describe(
      'the Cloudsmith service account. this will probably be your team name followed by the permissions access, e.g., cp-reliability-read-write.'
    )
})
