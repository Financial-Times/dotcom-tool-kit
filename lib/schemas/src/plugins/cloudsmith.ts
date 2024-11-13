import { z } from 'zod'

export const CloudsmithSchema = z.object({
  organisation: z.string().optional().describe('the Cloudsmith organisation'),
  serviceAccount: z.string().optional().describe('the Cloudsmith service account')
})
