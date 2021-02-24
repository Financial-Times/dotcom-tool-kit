import { test } from '@oclif/test'
console.log('hellooo') // eslint-disable-line no-console

describe('gtg', () => {
  test
    .stdout()
    .command(['gtg', '--app', 'ft-next-health-eu'])
    .it("tests an app's __gtg endopoint", (ctx) => {
      console.log(ctx) // eslint-disable-line no-console
      // expect(ctx.stdout).to.equal('')
    })
})
