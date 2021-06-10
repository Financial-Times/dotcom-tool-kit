import { test } from '@oclif/test'
console.log('hellooo')

describe('gtg', () => {
  test
    .stdout()
    .command(['gtg', '--app', 'ft-next-health-eu'])
    .it("tests an app's __gtg endopoint", (ctx) => {
      console.log(ctx)
      // expect(ctx.stdout).to.equal('')
    })
})
