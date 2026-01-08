<h1 align="center">
   <img alt="FT.com Tool Kit" src="etc/logo.svg" width="300">
</h1>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Financial-Times/dotcom-tool-kit/tree/main.svg?style=svg&circle-token=CCIPRJ_HM19rNZuXH3Bt8gVMH2zCx_1c1f8cb1579d9709be93c842bdc5d53314e7308f)](https://dl.circleci.com/status-badge/redirect/gh/Financial-Times/dotcom-tool-kit/tree/main)

Tool Kit is modern developer tooling for FT.com repositories. It's fully modular, allowing repos that need different tooling to install separate plugins that work consistently together.

Tool Kit only handles common tooling use cases that are required for most apps to work. Tool Kit sets up the minimal configuration for third party packages to run.

Your repo does not need to use Tool Kit for all of its tooling, and tooling not supported by Tool Kit can be configured directly in your repo.

## Installing Tool Kit

Firstly, you should make sure you're running a version of Node that Tool Kit supports. We're currently testing every commit on **Node 20** and **Node 22**, and can't guarantee that other Node versions will run Tool Kit as expected.

Install the core of Tool Kit as a `devDependency`:

```sh
npm install --save-dev dotcom-tool-kit
```

On its own, Tool Kit doesn't do anything, so you'll need to install some [plugins](./plugins) to give it functionality. For example, if you want to run Jest tests with `npm run test` via Tool Kit, you can install the `jest` and `npm` plugins:

```sh
npm install --save-dev @dotcom-tool-kit/npm @dotcom-tool-kit/jest
```

Add a `.toolkitrc.yml` to the root of your repository to include these plugins:

```yml
plugins:
  - '@dotcom-tool-kit/npm'
  - '@dotcom-tool-kit/jest'
```

Every time you change your `.toolkitrc.yml`, e.g. adding or removing a plugin or [configuring](#configuring-tool-kit) a hook, you should tell Tool Kit to install configuration files in your repository:

```sh
npx dotcom-tool-kit --install
```

## Running Tool Kit

You don't run Tool Kit directly; you run plugin tasks using things like npm scripts, automatically configured in your `package.json` by Tool Kit. With the `npm` and `jest` plugins installed, Jest tests are run with the npm `test` script:

```sh
npm run test
```

At any time, you can run `--help` to see what plugins you have installed, what configuration files they're managing, and what tasks you can run with them:

```sh
npx dotcom-tool-kit --help
```

## Core concepts

- Integration with tooling is grouped into modular **Plugins** that are installed separately.
- Tool Kit abstracts running other tooling with **Tasks**, written in Typescript.
- When running Tool Kit, you run **Commands**, which you (or a plugin) configure to run one or more Tasks.
- **Hooks** manage configuration files in your repository to run Commands from tooling such as npm scripts or CircleCI jobs.

The [concepts](./docs/concepts.md) document has more details about how these work together.

## Configuring Tool Kit

The `.toolkitrc.yml` file in your repo determines everything about how Tool Kit runs in that repo. It controls what plugins are included (which determine what hooks and tasks are available), gives you fine-grained control over what tasks are running on what commands, and lets you provide options to plugins, tasks, and hooks.

An example `.toolkitrc.yml` might look like:

```yml
plugins:
  # provides the test:local hooks
  - '@dotcom-tool-kit/npm'
  # provides the Jest task
  - '@dotcom-tool-kit/jest'
  # provides the Eslint task
  - '@dotcom-tool-kit/eslint'

commands:
  # run both Jest and ESlint when running `npm run test`
  # required to resolve the conflict between their defaults
  test:local:
    - Eslint
    - Jest
  # options for tasks can be set on a per-command basis
  test:e2e:
    - Jest
        configFile: jest.e2e.config.js

options:
  # ESlint plugin needs to know which files to run ESlint on.
  # there's a default setting, but your repo might need something else
  tasks:
    Eslint
      files:
        - server/**/*.js
  # instruct the hook that manages your repo's `package.json` to
  # install a command to run `test:e2e` as an npm script
  hooks:
    - PackageJson:
        scripts:
          test-e2e: 'test:e2e'
```

The options available for each plugin are documented in their readmes. If the tooling that a plugin is using has its own method of configuration (like `.eslintrc`, `.babelrc`, `jest.config.js`, `webpack.config.js`), Tool Kit options aren't used for that; they're not merged with that config and don't replace it. Tool Kit options are only for things that need to be known to run the tooling in the first place, or where tooling doesn't provide its own configuration.

## More documentation

- [Tool Kit's core concepts](./docs/concepts.md)
- [Extending Tool Kit with new tooling](./docs/extending-tool-kit.md)
- [How to resolve conflicts between plugins](./docs/resolving-plugin-conflicts.md)
- [Developing Tool Kit](./docs/developing-tool-kit.md)
- [Principles to follow for Tool Kit](./docs/tool-kit-principles.md)
