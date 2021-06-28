import * as path from 'path'
import * as puppeteer from 'puppeteer'
import NTest from '../../src/commands/n-test'

const configAbsolutePath = path.join(__dirname, '../files/smoke.js')
// n-test prepends the CWD to the given config path
const configPath = path.relative('', configAbsolutePath)

describe('n-test', () => {
  it('should pass when no errors', async () => {
    const command = new NTest([])
    command.options.config = configPath

    await command.run()
  })

  it('should fail when there are errors', async () => {
    const command = new NTest([])
    command.options.config = configPath
    puppeteer.__setResponseStatus(404)

    expect.assertions(1)
    try {
      await command.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
