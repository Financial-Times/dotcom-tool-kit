import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default new Heroku({ token: HEROKU_API_TOKEN })
