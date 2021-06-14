import GoodToGo from '../../src/commands/gtg'

describe('gtg', () => {
  it("tests and app's __gtg endpoint", async () => {
    // TODO mock the fetch function
    await GoodToGo.run(['--app', 'ft-next-health-eu'])
  })
})
