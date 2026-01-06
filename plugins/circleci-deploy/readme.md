# @dotcom-tool-kit/circleci-deploy

A plugin that will add CircleCI jobs that will interact with deployment services, such as AWS or Serverless, to your CircleCI config.

This plugin will require the additional installation of the plugin to handle your chosen deployment service(s) to actually run anything; this plugin defines hooks for other plugins to use, but no tasks to associate with those hooks. The plugin is installed as a dependency of the [containerised-app-with-assets](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/containerised-app-with-assets), [containerised-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/containerised-app), and [backend-serverless-app](https://github.com/Financial-Times/dotcom-tool-kit/tree/main/plugins/backend-serverless-app) plugins so you do not need to install it separately if you are using one of those plugins.

## Installation

Install `@dotcom-tool-kit/circleci-deploy` as a `devDependency` in your app:

```sh
npm install --save-dev @dotcom-tool-kit/circleci-deploy
```

Add the plugin to your [Tool Kit configuration](https://github.com/financial-times/dotcom-tool-kit/blob/main/readme.md#configuring-tool-kit):

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
