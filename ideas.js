// a base command class that takes care of wrapping another tool, potentially handling default arguments, which should take care of boilerplate for these sorts of tasks

class Lint extends Command {
  async run() {
    spawn('eslint', this.argv)
  }
}

class Build extends Command {
  async run() {
    // this.config.runHook('build')
    spawn('webpack', this.argv)
  }
}

// user-facing-app-heroku-build-plugin
class HerokuPostbuild extends Command {
  async run() {
    await Build.run(['--production'])
    await DeployAssets.run()
  }
}

// service-app-heroku-build-plugin
class HerokuPostbuild extends Command {
  async run() {
    await Build.run(['--production'])
  }
}

// dtk heroku-postbuild

// {
//    "scripts": {
//       "heroku-postbuild": "dtk heroku-postbuild",
//       "start"
//       "lint"
//       "build"
//    }
// }

// heroku-postbuil%:
// 	npm update
// 	@if [ -e bower.json ]; then $(BOWER_INSTALL); fi
// 	make build-production
// 	make deploy-assets
// 	npm prune --production #Need to explicitly run this so review apps are the same as production apps

// creating some built-in commands for app lifecycle (things like build etc) that don’t actually do anything, and allow other commands to register themselves to run for those commands (we could maybe use custom Oclif hooks for this)

// a convention for plugins that check their environment and set up anything necessary when they’re first installed, and whenever they’re run. so e.g. a @dotcom-tool-kit/heroku-postbuild would ensure that package.json has "heroku-postbuild": "dtk heroku-postbuild" in scripts, and you can run dtk heroku-postbuild:install to set that up manually if you need to
