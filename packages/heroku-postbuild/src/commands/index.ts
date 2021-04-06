import HerokuPostbuild from './heroku/postbuild'
import HerokuInstall from './heroku/install'

export default {
   'heroku:postbuild': HerokuPostbuild,
   'heroku:install': HerokuInstall
}
