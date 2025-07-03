import * as z from 'zod/v3'

export default z.object({
  testGlob: z.string().default('**/*.js'),
  formatGlob: z.string().default('**/*.js')
})
