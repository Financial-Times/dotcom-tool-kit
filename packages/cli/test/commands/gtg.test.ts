/**
 * @jest-environment node
 */
/* eslint-disable no-console */
/* eslint-disable quotes */
import { expect, test } from '@oclif/test'

const wait = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms))

describe('gtg', () => {
  test
  .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(200))
  .stdout()
  .command(['gtg', '--app', 'ft-next-health-eu'])
  .timeout(5000)
  .it(`tests an app's __gtg endopoint`, async (ctx) => {
    expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg')
  })
})
