import { z } from 'zod'

export const Pa11ySchema = z
  .object({
    configFile: z.string().optional().describe('Path to the config file')
  })
  .describe('runs `pa11y-ci` to execute Pa11y tests')

export type Pa11yOptions = z.infer<typeof Pa11ySchema>

export const Schema = Pa11ySchema
