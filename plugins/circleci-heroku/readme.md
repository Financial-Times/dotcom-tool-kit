# @dotcom-tool-kit/circleci-heroku

A plugin that will add CircleCI jobs that will interact with Heroku to the CircleCI config.

This plugin will be installed as a dependency of the [frontend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/frontend-app) and [backend-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-app) plugins so you do not need to install it separately if you are using either of those plugins.

## Installation

Install `@dotcom-tool-kit/circleci-heroku` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/circleci-heroku
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuration):

```yaml
plugins:
	- '@dotcom-tool-kit/circleci-heroku'
```

Install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

### For Tool Kit generated CircleCI `config.yml`

If you are migrating your project to Tool Kit for the first time then this plugin can generate a new `.circleci/config.yml` file for your project including Tool Kit configured workflows. To use this feature please delete or rename your existing CircleCI `config.yml` file before running the install command.

### Adding to a custom CircleCI `config.yml`

see [manually adding jobs to your CircleCI config](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/orb#manually)

## Hooks

| Event | Description | Installed to...| Default Tasks
|-|-|-|-|
| `deploy:review` | Create and test Heroku review app | `heroku-provision` job in `.circle/config.yml` | HerokuReview |
| `deploy:staging` | Deploy app to Heroku staging | `heroku-staging` job in `.circle/config.yml` | HerokuStaging |
| `test:review` | Run smoke tests | `e2e-test-review` job in `.circle/config.yml` | NTest, Pa11y |
| `test:staging` | Run smoke tests on staging | `e2e-test-staging` job in `.circle/config.yml` | NTest |
| `teardown:staging` | Scale down staging | `e2e-test-staging` job in `.circle/config.yml` | HerokuTeardown |
| `deploy:production` | Deploy to production | `heroku-promote` job in `.circle/config.yml` | HerokuProduction |
