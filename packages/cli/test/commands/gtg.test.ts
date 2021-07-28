import { describe, it } from '@jest/globals'
import GoodToGo from '../../src/commands/gtg'

describe('gtg', () => {
  // Skip test until arg parsing has been sorted out
  it.skip("tests and app's __gtg endpoint", async () => {
    // TODO mock the fetch function
    const command = new GoodToGo(['--app', 'ft-next-health-eu'])
    await command.run()
  })
})
