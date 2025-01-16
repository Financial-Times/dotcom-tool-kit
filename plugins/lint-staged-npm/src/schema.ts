import * as z from 'zod'

export default z.object({
  testGlob: z.string().default('**/*.js'),
  formatGlob: z.string().default('**/*.js')
})
