import { z } from 'zod'

export const SmokeTestSchema = z
  .object({
    browsers: z.string().array().optional().describe('Selenium browsers to run the test against'),
    host: z
      .string()
      .optional()
      .describe(
        'Set the hostname to use for all tests. If running in an environment such as a review or staging app build that has Tool Kit state with a URL for an app to run against, that will override this option.'
      ),
    config: z.string().optional().describe('Path to config file used to test'),
    interactive: z.boolean().optional().describe('Interactively choose which tests to run'),
    header: z.record(z.string()).optional().describe('Request headers to be sent with every request')
  })
  .describe('Run [n-test](https://github.com/financial-times/n-test) smoke tests against your application.')

export type SmokeTestOptions = z.infer<typeof SmokeTestSchema>

export const Schema = SmokeTestSchema
