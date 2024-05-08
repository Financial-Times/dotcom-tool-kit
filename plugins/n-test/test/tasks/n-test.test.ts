import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import * as puppeteer from 'puppeteer'
import NTest from '../../src/tasks/n-test.js'
import { writeState } from '@dotcom-tool-kit/state'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

const configAbsolutePath = path.join(__dirname, '../files/smoke.js')
// n-test prepends the CWD to the given config path
const configPath = path.relative('', configAbsolutePath)

describe('n-test', () => {
  it('should pass when no errors', async () => {
    const task = new NTest(
      logger,
      'NTest',
      {},
      {
        config: configPath
      }
    )

    await task.run()
  })

  it('should fail when there are errors', async () => {
    const task = new NTest(
      logger,
      'NTest',
      {},
      {
        config: configPath
      }
    )

    puppeteer.__setResponseStatus(404)

    expect.assertions(1)
    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should get app url from state', async () => {
    const appUrl = 'https://some-test-app.herokuapp.com'
    writeState('review', { url: appUrl })
    const task = new NTest(
      logger,
      'NTest',
      {},
      {
        config: configPath
      }
    )

    try {
      await task.run()
    } catch {}

    expect(task.options.host).toEqual(appUrl)
  })
})
