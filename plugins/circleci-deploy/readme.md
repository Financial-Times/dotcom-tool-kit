# @dotcom-tool-kit/circleci-deploy

A plugin that will add CircleCI jobs that will interact with deployment services, such as Heroku or Serverless, to your CircleCI config.

This plugin will require the additional installation of the plugin to handle your chosen deployment service(s) to actually run anything; this plugin defines hooks for other plugins to use, but no tasks to associate with those hooks. The plugin is installed as a dependency of the [frontend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/frontend-app) and [backend-heroku-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-heroku-app) plugins so you do not need to install it separately if you are using one of those plugins.

## Installation

Install `@dotcom-tool-kit/circleci-deploy` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/circleci-deploy
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/circleci-deploy'
```

Install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

### For Tool Kit generated CircleCI `config.yml`

If you are migrating your project to Tool Kit for the first time then this plugin can generate a new `.circleci/config.yml` file for your project including Tool Kit configured workflows. To use this feature please delete or rename your existing CircleCI `config.yml` file before running the install command.

### Adding to a custom CircleCI `config.yml`

See [manually adding jobs to your CircleCI config](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/orb#manually)

## Hooks

| Event | Description | Installed to...| Default Tasks
|-|-|-|-|
| `deploy:review` | Create and test review app | `deploy-review` job in `.circle/config.yml` | HerokuReview |
| `deploy:staging` | Deploy app to staging | `deploy-staging` job in `.circle/config.yml` | HerokuStaging |
| `test:review` | Run smoke tests | `e2e-test-review` job in `.circle/config.yml` | NTest, Pa11y |
| `test:staging` | Run smoke tests on staging | `e2e-test-staging` job in `.circle/config.yml` | NTest |
| `teardown:staging` | Scale down staging | `e2e-test-staging` job in `.circle/config.yml` | HerokuTeardown |
| `deploy:production` | Deploy to production | `deploy-production` job in `.circle/config.yml` | HerokuProduction |
