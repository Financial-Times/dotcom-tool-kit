# @dotcom-tool-kit/backend-app

This is a Tool Kit preset plugin to install and configure many of the plugins you'll need for a backend/API Node app.

It includes the following plugins:

- [`npm`](../npm) for hooks to run tasks locally
- [`circleci-heroku`](../circleci-heroku) for hooks to run tasks (including a pre-configured Heroku deployment workflow) on CircleCI
- [`node`](../node) for running your app locally

## Usage

Install the plugin as a `devDependency`:

```sh
npm install --save-dev @dotcom-tool-kit/backend-app
```

And add the plugin to the `plugins` array in your `.toolkitrc.yml`:

```yml
plugins:
  - "@dotcom-tool-kit/backend-app"
```
