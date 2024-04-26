import { z } from 'zod'

export const CypressSchema = z
  .object({
    url: z
      .string()
      .optional()
      .describe(
        'URL to run Cypress against. If running in an environment such as a review or staging app build that has Tool Kit state with a URL for an app to run against, that will override this option.'
      )
  })
  .describe('Run Cypress end-to-end tests')

export type CypressOptions = z.infer<typeof CypressSchema>

export const Schema = CypressSchema
