/* eslint-disable no-console */
require('node-fetch');

const nock = require('nock');
const pRetry = require('p-retry');
import { waitForOk } from '../../src/commands/gtg'

const GTG_URL = 'http://ft-next-health-eu.herokuapp.com/__gtg'

describe('gtg', () => {
  let nockScope;
	let reviewAppsNockScope;

	beforeAll(() => {

		nockScope = nock(GTG_URL)
			.matchHeader('accept', 'application/vnd.heroku+json; version=3');

		reviewAppsNockScope = nock(GTG_URL)
			.matchHeader('accept', 'application/vnd.heroku+json; version=3.review-apps');

		jest.mock('shellpromise', () => a => a, { virtual: true });

		// WARNING: Disable error logs, to clean up test output
		// Re-enable here if need be
		jest.spyOn(console, 'error').mockImplementation().mockName('console.error');

	});

	afterAll(() => {

		jest.unmock('shellpromise');
		jest.unmock('./github-api');

	});

	afterEach(() => {

		nock.cleanAll();
		jest.resetAllMocks();

	});
})






// ========================================================================
// import { expect, test } from '@oclif/test'


// describe('gtg', () => {
//   test
//   .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(200))
//   .stdout({print: true})
//   .command(['gtg', '--app', 'ft-next-health-eu'])
//   .timeout(5000)
//   .it(`tests an app's __gtg endopoint`, async (ctx) => {
//     expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg ok!')
//   })
// })

describe('waitForOk function', async () => {
  fetchMock.get('http://ft-next-health-eu.herokuapp.com/__gtg', 404);
  // expect(() => {
  //   waitForOk('http://ft-next-health-eu.herokuapp.com/__gtg')
  // }).to.throw('Error: 😢 http://ft-next-health-eu.herokuapp.com/__gtg did not respond with an ok response within two minutes.')
  await expect(waitForOk('http://ft-next-health-eu.herokuapp.com/__gtg')).to.eventually.be.rejectedWith(Error)

  // waitForOk('http://ft-next-health-eu.herokuapp.com/__gtg')
  // .catch(err => {
  //   console.log('=-----', err)
  //   expect('hello').to.equal('hello')
  //   expect(err.message).to.equal('Error: 😢 http://ft-next-health-eu.herokuapp.com/__gtg did not respond with an ok response within two minutes.')
  // })
})

// describe('gtg 500', () => {
//   test
//   .nock('http://ft-next-health-eu.herokuapp.com', api => api.get('/__gtg').reply(404).persist())
//   .stdout({print: true})
//   .stderr({ print: true})
//   .command(['gtg', '--app', 'ft-next-health-eu'])
//   .timeout(12000)
//   .it(`tests an app's __gtg endopoint when it returns a 500`, async (ctx, done) => {
//     console.log(ctx.stderr)
//     // expect(ctx.stderr).to.equal('')
//     // expect(ctx.stdout).to.contain('http://ft-next-health-eu.herokuapp.com/__gtg')
//     done()
//   })
// })
