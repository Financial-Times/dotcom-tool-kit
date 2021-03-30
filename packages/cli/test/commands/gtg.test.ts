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

describe('gtg timeout', () => {
  test
//   .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(404).persist())
  .stdout({print: true})
  .stderr()
  .command(['gtg', '--app', 'ft-next-health-eu'])
  .catch(err => expect(err.message).to.equal('😢 http://ft-next-health-eu.herokuapp.com/__gtg did not respond with an ok response within two minutes.'))
  .it('Timesout if does not respond during the timeout window')
})

const wait = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms))
describe('gtg 404', () => {
	test
    .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(404).persist())
	.stdout({print: true})
	// .stderr()
	.command(['gtg', '--app', 'ft-next-health-eu'])
	.timeout(13000)
	// .do(() => wait(40000))
  	// .catch(err => expect(err.message).to.equal('😢 http://ft-next-health-eu.herokuapp.com/__gtg did not respond with an ok response within two minutes.'))
	.it(`tests an app's __gtg endopoint`, async (ctx) => {
		expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg not ok!')
	})
  })


describe('gtg missing app', () => {
	test
	.stdout({print: true})
	.stderr({ print: true})
	.command(['gtg', '--app'])
	.catch(err => expect(err.message).to.match(/Flag --app expects a value/))
	.it('Throws error if no app provided')
  })
