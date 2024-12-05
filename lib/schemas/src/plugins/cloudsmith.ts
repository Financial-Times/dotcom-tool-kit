import { z } from 'zod'

export const CloudsmithSchema = z.object({
  serviceAccount: z.string().optional().describe('the Cloudsmith service account')
})
