import {expect, test} from '@oclif/test'

describe('gtg', () => {
  test
  .nock('https://api.heroku.com', api => api
    .get('/account')
    // user is logged in, return their name
    .reply(200, {email: 'jeff@example.com'})
  )
  .stdout()
  .command(['gtg'])
  .it(`tests an app's __gtg endopoint`, ctx => {
    expect(ctx.stdout).to.equal('jeff@example.com\n')
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/account')
    // HTTP 401 means the user is not logged in with valid credentials
    .reply(401)
  )
  .command(['gtg'])
  // checks to ensure the command exits with status 100
  .exit(100)
  .it('exits with status 100 when not logged in')
})
