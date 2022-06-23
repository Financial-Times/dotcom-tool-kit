import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/types'
import { Pa11ySchema } from '@dotcom-tool-kit/types/lib/schema/pa11y'
import pa11y from 'pa11y'

export default class Pa11y extends Task<typeof Pa11ySchema> {
  static description = ''

  async run(): Promise<void> {
    const reviewState = readState('review')
    // if we've built a review app, test against that, not the app in the config
    if (reviewState) {
      this.options.host = `https://${reviewState.appName}.herokuapp.com`
    }

    if (!this.options.host) {
      const error = new ToolKitError('no host option in your Tool Kit configuration')
      error.details = `the ${styles.plugin(
        'Pa11y'
      )} plugin needs to know the URL it should be testing when running locally. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/pa11y':
    host: 'example.ft.com'`

      throw error
    }

    const results = await pa11y(this.options.host, this.options)

    this.logger.info(`Running Pa11y on ${results.pageUrl}, document title ${results.documentTitle}`)
    if (results.issues?.length > 0) {
      const errorList: Array<string> = []
      const error = new ToolKitError('Pa11y found some errors')
      results.issues.forEach((issue, i, issues) => {
        const e = `Issue #${i + 1} of ${issues.length}: \n TypeCode: ${issue?.typeCode} \n Type: ${
          issue?.type
        } \n Message: ${issue?.message} \n Context: ${issue?.context} \n Selector: ${issue?.selector} \n`
        errorList.push(
          issue.typeCode === 1
            ? 'Pa11y failed to run due to a technical fault:\n' + e
            : 'Pa11y ran successfully but there were errors in the page:\n' + e
        )
      })
      error.details = errorList.join('\n\n')
      throw error
    }
    this.logger.info('Pa11y ran successfully, and there were no errors')
  }
}
