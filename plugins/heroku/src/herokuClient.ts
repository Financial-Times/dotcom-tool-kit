import Heroku from 'heroku-client'

const HEROKU_AUTH_TOKEN = process.env.HEROKU_AUTH_TOKEN

export default new Heroku({ token: HEROKU_AUTH_TOKEN })
