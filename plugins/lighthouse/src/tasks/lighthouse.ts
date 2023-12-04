import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
// import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import type { LighthouseSchema } from '@dotcom-tool-kit/types/lib/schema/lighthouse'

const startLighthouse = async (url = 'https://example.com') => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const runnerResult = await lighthouse(url, {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port
  })
  await chrome.kill()

  if (!runnerResult) {
    throw new Error('Lighthouse failed to run')
  }

  return runnerResult
}

abstract class LighthouseTask extends Task<typeof LighthouseSchema> {
  abstract taskArgs: string[]

  async run(): Promise<void> {
    const runnerResult = await startLighthouse(this.options.url)

    this.logger.info('Report is done for', runnerResult.lhr.finalDisplayedUrl)
    this.logger.info('Performance score was', runnerResult.lhr.categories.performance.score ?? 0 * 100)

    this.logger.info('Lighthouse completed successfully')
  }
}

export class LighthouseRun extends LighthouseTask {
  static description = 'Run Lighthouse against a URL'

  taskArgs = []
}
