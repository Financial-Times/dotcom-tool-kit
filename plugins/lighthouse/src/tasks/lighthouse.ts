import fs from 'fs'

// eslint-disable-next-line import/default
import lighthouseCli from 'lighthouse/lighthouse-cli'
import { Task } from '@dotcom-tool-kit/types'
import { waitOnExit } from '@dotcom-tool-kit/logger'
import { fork } from 'child_process'

const defaultLighthouseOptions = [
  'https://www.ft.com/content/fe9a5705-f3f4-4a00-b1bd-43adc0384286',
  '--output=json',
  '--chrome-flags="--headless"',
  "--config-path='./toolkit/cwv/lighthouse.config.js'",
  "--extraHeaders='./toolkit/cwv/headers.json'"
]

const runLighthouseAsChildProcess = (index = 1) => {
  const lighthouseOptions = [
    ...defaultLighthouseOptions,
    `--output-path=./toolkit/cwv/tmp/lighthouse-${index}.json`
  ]
  const childRunner = () => fork(lighthouseCli, lighthouseOptions, { silent: false })
  return childRunner
}

const average = (numbers: number[]) => numbers.reduce((a, b) => a + b) / numbers.length

export class LighthouseRun extends Task {
  // constructor(args) {
  // 	super(args);
  // }

  async run() {
    this.logger.info('LighthouseCWV starting')

    const lighthouseChildProcesses = [0, 1, 2, 3, 4].map(runLighthouseAsChildProcess)

    this.logger.info('LighthouseCWV Starting')

    for await (const childProcess of lighthouseChildProcesses) {
      const child = childProcess()
      await waitOnExit('lighthouse/cli', child)
    }

    const lighthouseResults = fs
      .readdirSync('./toolkit/cwv/tmp')
      .filter((file) => file.includes('lighthouse-') && file.includes('.json'))
      .map((file) => fs.readFileSync(`./toolkit/cwv/tmp/${file}`, 'utf8'))

    const lighthouseCoreWebVitals = lighthouseResults
      .map((file) => JSON.parse(file))
      .map((result) => result.audits)
      .map((audits) => ({
        'first-contentful-paint': audits['first-contentful-paint']?.numericValue,
        'largest-contentful-paint': audits['largest-contentful-paint']?.numericValue,
        'cumulative-layout-shift': audits['cumulative-layout-shift']?.numericValue,
        'total-blocking-time': audits['total-blocking-time']?.numericValue,
        'speed-index': audits['speed-index']?.numericValue
      }))

    const averageLighthouseCoreWebVitals = Object.entries(
      lighthouseCoreWebVitals.reduce(
        (acc, curr) => ({
          'first-contentful-paint': [...acc['first-contentful-paint'], curr['first-contentful-paint']],
          'largest-contentful-paint': [...acc['largest-contentful-paint'], curr['largest-contentful-paint']],
          'cumulative-layout-shift': [...acc['cumulative-layout-shift'], curr['cumulative-layout-shift']],
          'total-blocking-time': [...acc['total-blocking-time'], curr['total-blocking-time']],
          'speed-index': [...acc['speed-index'], curr['speed-index']]
        }),
        {
          'first-contentful-paint': [],
          'largest-contentful-paint': [],
          'cumulative-layout-shift': [],
          'total-blocking-time': [],
          'speed-index': []
        }
      )
    )
      .map(([key, value]) => [key, average(value)])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    this.logger.info(averageLighthouseCoreWebVitals)

    return
  }
}
