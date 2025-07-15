import { styles } from '@dotcom-tool-kit/logger'
import * as z from 'zod/v3'

export default z
  .object({
    pipeline: z
      .string()
      .describe(
        "the ID of your app's Heroku pipeline. this can be found at https://dashboard.heroku.com/pipelines/[PIPELINE_ID]"
      )
  })
  .passthrough()
  .refine((options) => !('scaling' in options), {
    message: `the option ${styles.code('scaling')} has moved to ${styles.code(
      `options.tasks.${styles.task('HerokuProduction')}.scaling`
    )}`
  })
