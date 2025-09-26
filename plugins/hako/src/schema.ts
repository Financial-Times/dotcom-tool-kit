import * as z from 'zod'

export default z.object({
  version: z
    .string()
    .regex(/[a-zA-Z\d_][a-zA-Z\d-_.]{0,127}/, 'must be a valid Docker tag')
    .default('0.2.14-beta')
    .describe(
      'version of the Hako CLI to use. see the [Hako releases](https://github.com/Financial-Times/hako-cli/releases/) for available versions'
    )
})
