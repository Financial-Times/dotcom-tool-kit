# @dotcom-tool-kit/circleci-heroku

## Deprecated

This plugin is deprecated. It is kept to preserve backwards compatibility for projects that previously depended on it, but just imports the `heroku` plugin as well as the new `circleci-deploy` plugin, which supersedes this plugin. It also sets the hooks exported by `circleci-deploy` to use the `heroku` tasks by default.

The `circleci-deploy` exports the same hooks that this plugin used to, but is renamed to be more generic – making explicit its support for other services to deploy to such as Serverless.

