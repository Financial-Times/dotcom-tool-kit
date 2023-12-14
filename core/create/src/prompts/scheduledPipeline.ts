import { rootLogger as winstonLogger, styles } from '@dotcom-tool-kit/logger'
import fetch from 'node-fetch'
import prompt from 'prompts'

export default async (): Promise<void> => {
  winstonLogger.info(
    `It looks like you had scheduled workflows configured in your CircleCI config. These have been deprecated by CircleCI and replaced by scheduled pipelines, and Tool Kit only supports the latter. You can follow the official migration guide (${styles.URL(
      'https://circleci.com/docs/migrate-scheduled-workflows-to-scheduled-pipelines/'
    )}) to fix this manually, or you can set up the scheduled trigger for your nightly workflow automatically with a few additional details.`
  )
  const { confirm } = await prompt({
    name: 'confirm',
    type: 'confirm',
    initial: true,
    message: 'Would you like the scheduled pipeline to be set up automatically?'
  })
  if (confirm) {
    let retry
    let prevSlug: string | undefined
    do {
      const { token, slug } = await prompt([
        {
          name: 'token',
          type: 'password',
          message: `Please enter a CircleCI API token. You can generate a token at ${styles.URL(
            'https://app.circleci.com/settings/user/tokens'
          )}. There's no way to create temporary CircleCI tokens at the moment so please remember to go back and delete the token after you're done!`
        },
        {
          name: 'slug',
          type: 'text',
          message:
            "Please enter the name of your project as it shows in GitHub. For example, the Tool Kit repository is 'dotcom-tool-kit'",
          initial: prevSlug
        }
      ])
      const scheduleName = 'nightly'
      const resp = await fetch(`https://circleci.com/api/v2/project/gh/Financial-Times/${slug}/schedule`, {
        method: 'POST',
        headers: { 'Circle-Token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleName,
          description: 'daily test of project via Tool Kit',
          // show the creator of the daily pipeline as CircleCI rather than
          // whoever ran this migration script
          'attribution-actor': 'system',
          parameters: {
            branch: 'main'
          },
          timetable: {
            'per-hour': 1,
            'hours-of-day': [0],
            'days-of-week': ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
          }
        })
      })
      if (resp.ok) {
        winstonLogger.info(
          `New scheduled pipeline successfully created with name ${styles.code(
            scheduleName
          )}. Please remember to go back and delete the token now that you're done!`
        )
        return
      }
      retry = (
        await prompt({
          name: 'retry',
          type: 'confirm',
          initial: true,
          message: `CircleCI API call returned an unsuccessful status code of ${styles.heading(
            resp.status.toString()
          )}. Would you like to re-enter the details and try again?`
        })
      ).retry
      prevSlug = slug
    } while (retry)
  }
}
