/* eslint-disable no-console */
import { expect, test } from '@oclif/test'

describe('gtg', () => {
  test
  .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(200))
  .stdout({print: true})
  .command(['gtg', '--app', 'ft-next-health-eu'])
  .timeout(5000)
  .it(`tests an app's __gtg endopoint`, async (ctx) => {
    expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg ok!')
  })
})

describe('gtg 500', () => {
  test
  .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(500))
  .stdout({print: true})
  .command(['gtg', '--app', 'ft-next-health-eu'])
  .timeout(5000)
  .it(`tests an app's __gtg endopoint when it returns a 500`, async (ctx) => {
    expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg')
  })
})
