import * as z from 'zod'

export default z.object({
  serviceAccount: z
    .string()
    .optional()
    .describe(
      'the Cloudsmith service account. this will probably be your team name followed by the permissions access, e.g., cp-reliability-read-write.'
    )
})
