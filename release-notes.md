:robot: I have created a release *beep* *boop*
---


<details><summary>babel: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/babel-v3.2.0...babel-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* move babel options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move babel options to task options and allow configuring env ([f707366](https://github.com/Financial-Times/dotcom-tool-kit/commit/f707366f27e6a38175afa7dbf2a549c0ba8f67b7))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>backend-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/backend-app-v3.2.4...backend-app-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/backend-heroku-app bumped from ^3.1.4 to ^4.0.0
</details>

<details><summary>backend-heroku-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/backend-heroku-app-v3.1.4...backend-heroku-app-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.3 to ^4.0.0
    * @dotcom-tool-kit/heroku bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/node bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
</details>

<details><summary>backend-serverless-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/backend-serverless-app-v3.2.7...backend-serverless-app-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.3 to ^4.0.0
    * @dotcom-tool-kit/node bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
    * @dotcom-tool-kit/serverless bumped from ^2.4.4 to ^3.0.0
</details>

<details><summary>base: 1.0.0</summary>

## 1.0.0 (2024-04-30)


###   BREAKING CHANGES

* rename Task#options to pluginOptions
* move base classes into their own package

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>circleci: 7.0.0</summary>

## [7.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v6.0.1...circleci-v7.0.0) (2024-04-30)


###   BREAKING CHANGES

* remove serverless buildNumVariable in favour of populating it via CI state
* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* rename Hook#check to Hook#isInstalled
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* add list of files that CircleCI and package.json hooks manage ([acf2e08](https://github.com/Financial-Times/dotcom-tool-kit/commit/acf2e0805882d6a8fb63177b150795dc8b022712))
* add support for a managesFiles entry in hook installs fields ([e0e9b05](https://github.com/Financial-Times/dotcom-tool-kit/commit/e0e9b055decf3b0ca39caf49de7931f444b9f505))
* allow hook classes to specify an options schema ([2b884bf](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b884bfd607d5df6e3190b40ab9fa3c225d4572c))
* **circleci:** allow projects to rewrite whole CircleCI config ([37507f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/37507f1cad182fcc6956067017cb5ab056ea78b9))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([641e242](https://github.com/Financial-Times/dotcom-tool-kit/commit/641e242f7edf95bbd7c31bcba89eb532cf9427d1))
* **circleci:** don't generate matrices if only one Node version used ([ce7d9c2](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce7d9c254f8a5c075377b8846fe6c63a10567566))
* export CircleCiConfig hook ([f9e81b7](https://github.com/Financial-Times/dotcom-tool-kit/commit/f9e81b756cf48bf68eb3a057427e5cd6a05a8e88))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* overhaul help output for new abstractions & config structure ([e513389](https://github.com/Financial-Times/dotcom-tool-kit/commit/e513389d4a60ed54b3562dc7c8aad23dae81431d))
* remove serverless buildNumVariable in favour of populating it via CI state ([bf9fa13](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9fa136d2dd21a6f2590d5b0b5082be7ffd5983))


### Bug Fixes

* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Code Refactoring

* rename Hook#check to Hook#isInstalled ([a3db11a](https://github.com/Financial-Times/dotcom-tool-kit/commit/a3db11acfb7f529f0e138543f3b35e5577a634e1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>circleci-deploy: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.4.3...circleci-deploy-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **circleci-deploy:** define Cypress and Serverless options with tags ([b0585c3](https://github.com/Financial-Times/dotcom-tool-kit/commit/b0585c3ac17474454af9796822b50f36c3b0f793))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([641e242](https://github.com/Financial-Times/dotcom-tool-kit/commit/641e242f7edf95bbd7c31bcba89eb532cf9427d1))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.1 to ^7.0.0
</details>

<details><summary>circleci-heroku: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-heroku-v3.2.4...circleci-heroku-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.3 to ^4.0.0
    * @dotcom-tool-kit/heroku bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>circleci-npm: 6.0.0</summary>

## [6.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-npm-v5.3.3...circleci-npm-v6.0.0) (2024-04-30)


###   BREAKING CHANGES

* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* **circleci:** define CircleCI configs in .toolkitrc.yml ([641e242](https://github.com/Financial-Times/dotcom-tool-kit/commit/641e242f7edf95bbd7c31bcba89eb532cf9427d1))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.1 to ^7.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
</details>

<details><summary>component: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/component-v4.1.3...component-v5.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package

### Features

* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-npm bumped from ^5.3.3 to ^6.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
</details>

<details><summary>config: 1.0.0</summary>

## 1.0.0 (2024-04-30)


###   BREAKING CHANGES

* rename SchemaOptions to PluginOptions

### Features

* **cli:** add support for tags in config that resolve based on options ([e8cd1b8](https://github.com/Financial-Times/dotcom-tool-kit/commit/e8cd1b8614fe3b92d583b3d093976c433b246e4b))
* collect and store the hook-managed files in config ([731e55d](https://github.com/Financial-Times/dotcom-tool-kit/commit/731e55d3930f348a4e1f3b6da5b33b78ea65f89d))
* load plugin rcfile task options into config ([e749170](https://github.com/Financial-Times/dotcom-tool-kit/commit/e749170d67a82064d205b7304b536c6c06a633c5))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))


### Bug Fixes

* **cli:** avoid hook installation conflicts between niblings ([9d9274a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d9274ab19197283315efc68d4b466bd826f3388))
* remove conflicts from task options in valid config type ([27b5783](https://github.com/Financial-Times/dotcom-tool-kit/commit/27b5783fcbab9df2018757f4ea06178ceac74c78))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([7de8626](https://github.com/Financial-Times/dotcom-tool-kit/commit/7de862654fe2ca474ddfd6b28bc133a4de17c803))
</details>

<details><summary>conflict: 1.0.0</summary>

## 1.0.0 (2024-04-30)


### Features

* move conflict into its own package ([7d0765a](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d0765ac8268ad60602055c7ac0c7750fa31c7f9))
</details>

<details><summary>create: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/create-v3.7.1...create-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries
* instantiate a separate hook instance per hook installation request from configs
* make plugin loading even lazier by having separate entrypoints for each task and hook
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow hook classes to specify an options schema ([2b884bf](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b884bfd607d5df6e3190b40ab9fa3c225d4572c))
* allow plugins to specify init entrypoints ([f46c5cb](https://github.com/Financial-Times/dotcom-tool-kit/commit/f46c5cbaa4905fac55cd368bb8a6f7ef9d388911))
* load hook installations from options.hooks ([2f0c2b6](https://github.com/Financial-Times/dotcom-tool-kit/commit/2f0c2b68e6668fdbcc14c88458243f7377eefe39))
* load plugin rcfile task options into config ([e749170](https://github.com/Financial-Times/dotcom-tool-kit/commit/e749170d67a82064d205b7304b536c6c06a633c5))
* make plugin loading even lazier by having separate entrypoints for each task and hook ([c66ec83](https://github.com/Financial-Times/dotcom-tool-kit/commit/c66ec83ab9ab9560b3e2835b559cada0e89b3020))
* move plugin options to a sub key of toolkitrc options entries ([9eaa9b0](https://github.com/Financial-Times/dotcom-tool-kit/commit/9eaa9b0475a471769d5b86fe103139aadfd6e8a6))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Bug Fixes

* **create:** no longer need to clean cosmiconfig as we've dropped it ([e120891](https://github.com/Financial-Times/dotcom-tool-kit/commit/e120891eb7b03633a8805da801374a196c128576))
* **create:** use Doppler-managed AWS key format ([67622a4](https://github.com/Financial-Times/dotcom-tool-kit/commit/67622a456df0517fc6b5572109b5f5418324fe2b))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* instantiate a separate hook instance per hook installation request from configs ([8e763f0](https://github.com/Financial-Times/dotcom-tool-kit/commit/8e763f0463126847ac2cbe17f3ff9c362a3026b5))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
  * devDependencies
    * dotcom-tool-kit bumped from ^3.4.5 to ^4.0.0
</details>

<details><summary>cypress: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v4.0.1...cypress-v5.0.0) (2024-04-30)


###   BREAKING CHANGES

* move cypress localUrl plugin option to a url task option and change precedence
* consolidate cypress tasks using similar logic to n-test for urls
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* consolidate cypress tasks using similar logic to n-test for urls ([8be42de](https://github.com/Financial-Times/dotcom-tool-kit/commit/8be42de121c8c2000a7880e2c22db3cadf96e2aa))
* **cypress:** add PackageJson hook options ([c06e060](https://github.com/Financial-Times/dotcom-tool-kit/commit/c06e060180d2f126c5c03d8cf9a366eddb26d6d3))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move cypress localUrl plugin option to a url task option and change precedence ([e9d11ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9d11ef13ac83e567d049aa66f2878eb77d3de1c))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>doppler: 2.0.0</summary>

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.1.0...doppler-v2.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Features

* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/vault bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>error: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/error-v3.2.0...error-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
</details>

<details><summary>eslint: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.2.0...eslint-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* move eslint plugin options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* add configPath option for eslint task ([9d532fa](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d532fa2f9438cf2b518a62fb3b306c071656429))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move eslint plugin options to task options ([d9a0d62](https://github.com/Financial-Times/dotcom-tool-kit/commit/d9a0d62633875ca198308dae3e0e2fa35cd7c621))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>frontend-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/frontend-app-v3.2.4...frontend-app-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/backend-heroku-app bumped from ^3.1.4 to ^4.0.0
    * @dotcom-tool-kit/upload-assets-to-s3 bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/webpack bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>heroku: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v3.4.1...heroku-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* split heroku options into plugin-wide and heroku production task-specific
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* **heroku:** add PackageJson hook options ([f319cda](https://github.com/Financial-Times/dotcom-tool-kit/commit/f319cda3bfcbc49d2734213e5403ca70a7bffe87))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split heroku options into plugin-wide and heroku production task-specific ([9653311](https://github.com/Financial-Times/dotcom-tool-kit/commit/9653311b8d9424327b6f217d626389674472d332))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>husky-npm: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.2.0...husky-npm-v5.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* delete the husky hook
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **husky-npm:** add PackageJson hook options ([554996e](https://github.com/Financial-Times/dotcom-tool-kit/commit/554996e864401faf5c1c6231be0336ab47a4a046))
* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* delete the husky hook ([38dd539](https://github.com/Financial-Times/dotcom-tool-kit/commit/38dd5391fa5f706926387479faca7ba2b9bbefdc))
* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>jest: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/jest-v3.4.0...jest-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* change jest "mode" option to a boolean "ci" option
* move jest options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* change jest "mode" option to a boolean "ci" option ([f067721](https://github.com/Financial-Times/dotcom-tool-kit/commit/f0677219c15bac5da514fae6f1226317c5525e5d))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move jest options to task options and allow configuring env ([29ed0f2](https://github.com/Financial-Times/dotcom-tool-kit/commit/29ed0f2843b97732379cdf2c342de8e6ed748409))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>lint-staged: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-v4.2.0...lint-staged-v5.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>lint-staged-npm: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v3.2.0...lint-staged-npm-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **lint-staged-npm:** add PackageJson hook options ([e6e8f39](https://github.com/Financial-Times/dotcom-tool-kit/commit/e6e8f397b8661fd62a5b2fba4cdec3fa9be0f1a5))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>logger: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.4.0...logger-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Features

* better group --help output ([72f0d2e](https://github.com/Financial-Times/dotcom-tool-kit/commit/72f0d2e1025c22a50c1010310f817206be32f4cb))
* overhaul help output for new abstractions & config structure ([e513389](https://github.com/Financial-Times/dotcom-tool-kit/commit/e513389d4a60ed54b3562dc7c8aad23dae81431d))
* various help formatting and working tweaks idk ([5073668](https://github.com/Financial-Times/dotcom-tool-kit/commit/50736684687080074ec9d0f7082039e83d51d877))


### Bug Fixes

* explicitly set error etc mark forgrounds to black for better contrast ([9f03f9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9f03f9a8a91b93a90bd88551c5d307063f50e478))
* remove stray unicode variant selector in error mark ([7812f57](https://github.com/Financial-Times/dotcom-tool-kit/commit/7812f570b94032bc2559eee1ae51e632ff71800e))
* switch from upstream boxen to my fork ([d08730a](https://github.com/Financial-Times/dotcom-tool-kit/commit/d08730a05ff110a742c961be5f7cb60ff16669c6))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>mocha: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/mocha-v3.2.0...mocha-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* move mocha options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move mocha options to task options ([08b092b](https://github.com/Financial-Times/dotcom-tool-kit/commit/08b092bc1f3af5ee56413f17a7affdab3eed057e))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>n-test: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/n-test-v3.3.1...n-test-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* move n-test options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move n-test options to task options ([c74af9b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c74af9b4394493f52287c38d0b0402c9b3f61cc6))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>next-router: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/next-router-v3.4.1...next-router-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>node: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/node-v3.4.1...node-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* rename node useVault option to useDoppler
* move node options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* make ports optional in node and nodemon tasks ([c5b63af](https://github.com/Financial-Times/dotcom-tool-kit/commit/c5b63af05f6a7420498691966286a7059a046ff4))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move node options to task options ([38b3146](https://github.com/Financial-Times/dotcom-tool-kit/commit/38b31467c94a40f009d354ac84eef1866a1e516f))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* rename node useVault option to useDoppler ([3cfa085](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cfa0857340778d7ef09f27e1d2f809a35236df9))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
</details>

<details><summary>nodemon: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.4.1...nodemon-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* rename nodemon useVault option to useDoppler
* move nodemon options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* make ports optional in node and nodemon tasks ([c5b63af](https://github.com/Financial-Times/dotcom-tool-kit/commit/c5b63af05f6a7420498691966286a7059a046ff4))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move nodemon options to task options ([3cc635c](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cc635c7afe8a63d8b20c634124e4d46dfa9e4ee))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* rename nodemon useVault option to useDoppler ([53a051f](https://github.com/Financial-Times/dotcom-tool-kit/commit/53a051f214620b5109a9ac2d2078298256d4b648))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
</details>

<details><summary>npm: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/npm-v3.3.1...npm-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))
* **npm:** add PackageJson hook options ([13369a9](https://github.com/Financial-Times/dotcom-tool-kit/commit/13369a9f50ad619402c279f52e957e377a7f9d42))


### Bug Fixes

* make npm publish error messages CI-agnostic ([c3999ed](https://github.com/Financial-Times/dotcom-tool-kit/commit/c3999edeefe8c41b5ce43f4953d306bf348744fa))
* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>options: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/options-v3.2.0...options-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* rename SchemaOptions to PluginOptions

### Features

* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([7de8626](https://github.com/Financial-Times/dotcom-tool-kit/commit/7de862654fe2ca474ddfd6b28bc133a4de17c803))
</details>

<details><summary>pa11y: 0.6.0</summary>

## [0.6.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/pa11y-v0.5.2...pa11y-v0.6.0) (2024-04-30)


###   BREAKING CHANGES

* move pa11y options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move pa11y options to task options ([d6ac04c](https://github.com/Financial-Times/dotcom-tool-kit/commit/d6ac04ce71eece7e0ee138cab75087c9f980c49a))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
</details>

<details><summary>package-json-hook: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.2.0...package-json-hook-v5.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* rename Hook#check to Hook#isInstalled

### Features

* add list of files that CircleCI and package.json hooks manage ([acf2e08](https://github.com/Financial-Times/dotcom-tool-kit/commit/acf2e0805882d6a8fb63177b150795dc8b022712))
* add support for a managesFiles entry in hook installs fields ([e0e9b05](https://github.com/Financial-Times/dotcom-tool-kit/commit/e0e9b055decf3b0ca39caf49de7931f444b9f505))
* allow hook classes to specify an options schema ([2b884bf](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b884bfd607d5df6e3190b40ab9fa3c225d4572c))
* implement options for packagejson hook ([800db83](https://github.com/Financial-Times/dotcom-tool-kit/commit/800db833c5183cef84c2c03e1140202f03b2a8e6))
* implement PackageJson.overrideChildInstallations ([eb78da5](https://github.com/Financial-Times/dotcom-tool-kit/commit/eb78da57af4de0c9ef5aa6f91fb25a460ef2a20f))
* implement PackageJsonHook.mergeChildInstallations ([2cc1270](https://github.com/Financial-Times/dotcom-tool-kit/commit/2cc1270a0cec9aa18e73783d4d738ad9937460e8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move conflict into its own package ([7d0765a](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d0765ac8268ad60602055c7ac0c7750fa31c7f9))
* move package-json-hook to plugins and export PackageJson hook ([e36d552](https://github.com/Financial-Times/dotcom-tool-kit/commit/e36d552f054526e4730781e1cd344d07e090fa6b))
* overhaul help output for new abstractions & config structure ([e513389](https://github.com/Financial-Times/dotcom-tool-kit/commit/e513389d4a60ed54b3562dc7c8aad23dae81431d))
* **package-json-hook:** allow full stops to be escaped so they aren't split as paths ([b506f23](https://github.com/Financial-Times/dotcom-tool-kit/commit/b506f2355c794a0c58c220c7a16ea3427d97e586))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* support trailing string in packagejson options ([d69c4e1](https://github.com/Financial-Times/dotcom-tool-kit/commit/d69c4e18d1070dd81fac935b0caaefb84916e25e))


### Bug Fixes

* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Hook#check to Hook#isInstalled ([a3db11a](https://github.com/Financial-Times/dotcom-tool-kit/commit/a3db11acfb7f529f0e138543f3b35e5577a634e1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
</details>

<details><summary>plugin: 1.0.0</summary>

## 1.0.0 (2024-04-30)


###   BREAKING CHANGES

* only load plugins if their toolkitrc version matches the current version
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries

### Features

* add support for a managesFiles entry in hook installs fields ([e0e9b05](https://github.com/Financial-Times/dotcom-tool-kit/commit/e0e9b055decf3b0ca39caf49de7931f444b9f505))
* allow specifying command task options in a toolkitrc ([bb091c8](https://github.com/Financial-Times/dotcom-tool-kit/commit/bb091c8d78ee8e71441c51da3f2e9a8d273ffeee))
* load hook installations from options.hooks ([2f0c2b6](https://github.com/Financial-Times/dotcom-tool-kit/commit/2f0c2b68e6668fdbcc14c88458243f7377eefe39))
* load plugin rcfile task options into config ([e749170](https://github.com/Financial-Times/dotcom-tool-kit/commit/e749170d67a82064d205b7304b536c6c06a633c5))
* move plugin options to a sub key of toolkitrc options entries ([9eaa9b0](https://github.com/Financial-Times/dotcom-tool-kit/commit/9eaa9b0475a471769d5b86fe103139aadfd6e8a6))
* only load plugins if their toolkitrc version matches the current version ([3c98760](https://github.com/Financial-Times/dotcom-tool-kit/commit/3c987609092a629e3000b43f8c5fdb4592ffc789))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
</details>

<details><summary>prettier: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.2.0...prettier-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* remove prettier configOptions option
* move prettier options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move prettier options to task options ([945aa82](https://github.com/Financial-Times/dotcom-tool-kit/commit/945aa82a8aad8b622683eb8f07e5dc8180e93c5a))
* **prettier:** add PackageJson hook options ([5f0082d](https://github.com/Financial-Times/dotcom-tool-kit/commit/5f0082de3a5c0dbe3ce9ca37c82cfa882a396f5f))
* remove prettier configOptions option ([06f358e](https://github.com/Financial-Times/dotcom-tool-kit/commit/06f358e71f8d62ae58fe05527621ac001dcdff4b))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Bug Fixes

* **prettier:** correct hook option field in config ([0ba7204](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ba7204da93663a30653b5583b21973128396cb0))
* require package-json-hook plugin in plugins that use PackageJson hook ([49d9733](https://github.com/Financial-Times/dotcom-tool-kit/commit/49d97337da2a6c92440f32ba7740e28ec3fc7edc))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove all current concrete hook subclasses ([ce2dd4b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce2dd4bf29b81e0160c7a70d2dde3623cb5e9d7a))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>schemas: 1.0.0</summary>

## 1.0.0 (2024-04-30)


###   BREAKING CHANGES

* **upload-assets-to-s3:** remove legacy environment variable handling
* change jest "mode" option to a boolean "ci" option
* move serverless run ports and useDoppler options to task options
* remove serverless buildNumVariable in favour of populating it via CI state
* rename serverless useVault option to useDoppler
* split heroku options into plugin-wide and heroku production task-specific
* move cypress localUrl plugin option to a url task option and change precedence
* move n-test options to task options
* move webpack options to task options and allow configuring env
* move upload-assets-to-s3 options to task options
* remove typescript extraArgs option
* consolidate typescript tasks and move options to task options
* remove prettier configOptions option
* move prettier options to task options
* move pa11y options to task options
* rename nodemon useVault option to useDoppler
* move nodemon options to task options
* rename node useVault option to useDoppler
* move node options to task options
* move mocha options to task options
* move jest options to task options and allow configuring env
* move eslint plugin options to task options
* move babel options to task options and allow configuring env
* **circleci:** define CircleCI configs in .toolkitrc.yml
* rename SchemaOptions to PluginOptions

### Features

* add (empty) schema exports for task schemas ([a7e6891](https://github.com/Financial-Times/dotcom-tool-kit/commit/a7e68911148679be4138cb7ebf8ecc55b45a4e28))
* add configPath option for eslint task ([9d532fa](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d532fa2f9438cf2b518a62fb3b306c071656429))
* add watch, noEmit and build options to typescript task ([8324d5f](https://github.com/Financial-Times/dotcom-tool-kit/commit/8324d5fec839d12b034f34ead35d62e441b60a8c))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* change jest "mode" option to a boolean "ci" option ([f067721](https://github.com/Financial-Times/dotcom-tool-kit/commit/f0677219c15bac5da514fae6f1226317c5525e5d))
* **circleci:** allow projects to rewrite whole CircleCI config ([37507f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/37507f1cad182fcc6956067017cb5ab056ea78b9))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([641e242](https://github.com/Financial-Times/dotcom-tool-kit/commit/641e242f7edf95bbd7c31bcba89eb532cf9427d1))
* consolidate typescript tasks and move options to task options ([55f8c4c](https://github.com/Financial-Times/dotcom-tool-kit/commit/55f8c4caf23cb09d874eb0968172058b7d899228))
* explicitly handle legacy plugin options ([afc8d54](https://github.com/Financial-Times/dotcom-tool-kit/commit/afc8d54561bba42b133716c62e4b120dde27d8df))
* **lint-staged-npm:** add PackageJson hook options ([e6e8f39](https://github.com/Financial-Times/dotcom-tool-kit/commit/e6e8f397b8661fd62a5b2fba4cdec3fa9be0f1a5))
* make ports optional in node and nodemon tasks ([c5b63af](https://github.com/Financial-Times/dotcom-tool-kit/commit/c5b63af05f6a7420498691966286a7059a046ff4))
* move babel options to task options and allow configuring env ([f707366](https://github.com/Financial-Times/dotcom-tool-kit/commit/f707366f27e6a38175afa7dbf2a549c0ba8f67b7))
* move cypress localUrl plugin option to a url task option and change precedence ([e9d11ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9d11ef13ac83e567d049aa66f2878eb77d3de1c))
* move eslint plugin options to task options ([d9a0d62](https://github.com/Financial-Times/dotcom-tool-kit/commit/d9a0d62633875ca198308dae3e0e2fa35cd7c621))
* move jest options to task options and allow configuring env ([29ed0f2](https://github.com/Financial-Times/dotcom-tool-kit/commit/29ed0f2843b97732379cdf2c342de8e6ed748409))
* move mocha options to task options ([08b092b](https://github.com/Financial-Times/dotcom-tool-kit/commit/08b092bc1f3af5ee56413f17a7affdab3eed057e))
* move n-test options to task options ([c74af9b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c74af9b4394493f52287c38d0b0402c9b3f61cc6))
* move node options to task options ([38b3146](https://github.com/Financial-Times/dotcom-tool-kit/commit/38b31467c94a40f009d354ac84eef1866a1e516f))
* move nodemon options to task options ([3cc635c](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cc635c7afe8a63d8b20c634124e4d46dfa9e4ee))
* move pa11y options to task options ([d6ac04c](https://github.com/Financial-Times/dotcom-tool-kit/commit/d6ac04ce71eece7e0ee138cab75087c9f980c49a))
* move prettier options to task options ([945aa82](https://github.com/Financial-Times/dotcom-tool-kit/commit/945aa82a8aad8b622683eb8f07e5dc8180e93c5a))
* move serverless run ports and useDoppler options to task options ([61fbaae](https://github.com/Financial-Times/dotcom-tool-kit/commit/61fbaaec890b51861cedf6076691fa5dc1bc5873))
* move upload-assets-to-s3 options to task options ([d733325](https://github.com/Financial-Times/dotcom-tool-kit/commit/d73332579afedec9c3027c09ab1efd6f1e58d73c))
* move webpack options to task options and allow configuring env ([9f85554](https://github.com/Financial-Times/dotcom-tool-kit/commit/9f85554362cbbf4c2207e61165cf5d0ae1e0dc01))
* remove prettier configOptions option ([06f358e](https://github.com/Financial-Times/dotcom-tool-kit/commit/06f358e71f8d62ae58fe05527621ac001dcdff4b))
* remove serverless buildNumVariable in favour of populating it via CI state ([bf9fa13](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9fa136d2dd21a6f2590d5b0b5082be7ffd5983))
* remove typescript extraArgs option ([426d82f](https://github.com/Financial-Times/dotcom-tool-kit/commit/426d82f6ef3b600ec416448470ab46cb90058afe))
* rename node useVault option to useDoppler ([3cfa085](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cfa0857340778d7ef09f27e1d2f809a35236df9))
* rename nodemon useVault option to useDoppler ([53a051f](https://github.com/Financial-Times/dotcom-tool-kit/commit/53a051f214620b5109a9ac2d2078298256d4b648))
* rename serverless useVault option to useDoppler ([5d39489](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d3948960cb8a96f85728123f35add35b75022a2))
* split heroku options into plugin-wide and heroku production task-specific ([9653311](https://github.com/Financial-Times/dotcom-tool-kit/commit/9653311b8d9424327b6f217d626389674472d332))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* **upload-assets-to-s3:** remove legacy environment variable handling ([1eb0d6b](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eb0d6bd1a1e15e92899f9a3e7784a1928e617e4))


### Bug Fixes

* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([7de8626](https://github.com/Financial-Times/dotcom-tool-kit/commit/7de862654fe2ca474ddfd6b28bc133a4de17c803))
</details>

<details><summary>serverless: 3.0.0</summary>

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.4.4...serverless-v3.0.0) (2024-04-30)


###   BREAKING CHANGES

* move serverless run ports and useDoppler options to task options
* remove unused legacy vault/doppler support from serverless deploy/provision/teardown tasks
* remove serverless buildNumVariable in favour of populating it via CI state
* rename serverless useVault option to useDoppler
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move serverless run ports and useDoppler options to task options ([61fbaae](https://github.com/Financial-Times/dotcom-tool-kit/commit/61fbaaec890b51861cedf6076691fa5dc1bc5873))
* remove serverless buildNumVariable in favour of populating it via CI state ([bf9fa13](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9fa136d2dd21a6f2590d5b0b5082be7ffd5983))
* rename serverless useVault option to useDoppler ([5d39489](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d3948960cb8a96f85728123f35add35b75022a2))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove unused legacy vault/doppler support from serverless deploy/provision/teardown tasks ([ad60eee](https://github.com/Financial-Times/dotcom-tool-kit/commit/ad60eee53c9af71b2455ca041cae4a669a40a245))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.0 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>state: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.3.0...state-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* remove serverless buildNumVariable in favour of populating it via CI state
* drop support for Node 16

### Features

* **core:** run hook checks when running tasks if files have changed ([f3dfad4](https://github.com/Financial-Times/dotcom-tool-kit/commit/f3dfad4da47cdf788dc4299d465177c8e1504523))
* read list of files to hash from config ([1159be1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1159be17ffca3ab6a8a4fdf68be1b23d0e3e23aa))
* remove serverless buildNumVariable in favour of populating it via CI state ([bf9fa13](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9fa136d2dd21a6f2590d5b0b5082be7ffd5983))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
</details>

<details><summary>typescript: 3.0.0</summary>

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.2.0...typescript-v3.0.0) (2024-04-30)


###   BREAKING CHANGES

* remove typescript extraArgs option
* consolidate typescript tasks and move options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* add watch, noEmit and build options to typescript task ([8324d5f](https://github.com/Financial-Times/dotcom-tool-kit/commit/8324d5fec839d12b034f34ead35d62e441b60a8c))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* consolidate typescript tasks and move options to task options ([55f8c4c](https://github.com/Financial-Times/dotcom-tool-kit/commit/55f8c4caf23cb09d874eb0968172058b7d899228))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* remove typescript extraArgs option ([426d82f](https://github.com/Financial-Times/dotcom-tool-kit/commit/426d82f6ef3b600ec416448470ab46cb90058afe))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* **typescript:** add support for typescript@5 as peer dependency ([2f658c4](https://github.com/Financial-Times/dotcom-tool-kit/commit/2f658c4f169d97f76ff8c6dbbe1896fd2423262f))


### Bug Fixes

* **typescript:** point config to correct module path for task ([4ad1221](https://github.com/Financial-Times/dotcom-tool-kit/commit/4ad1221840e3c869c3628796d3ce0b72f17cc7b7))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([c834207](https://github.com/Financial-Times/dotcom-tool-kit/commit/c83420750f9282b550014ae5c3d2cc5b698fd8ca))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>upload-assets-to-s3: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v3.2.0...upload-assets-to-s3-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* **upload-assets-to-s3:** remove legacy environment variable handling
* move upload-assets-to-s3 options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move upload-assets-to-s3 options to task options ([d733325](https://github.com/Financial-Times/dotcom-tool-kit/commit/d73332579afedec9c3027c09ab1efd6f1e58d73c))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* **upload-assets-to-s3:** remove legacy environment variable handling ([1eb0d6b](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eb0d6bd1a1e15e92899f9a3e7784a1928e617e4))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>validated: 1.0.0</summary>

## 1.0.0 (2024-04-30)


### Features

* move validated into its own package ([4068b37](https://github.com/Financial-Times/dotcom-tool-kit/commit/4068b371b4ddcac10302412132665b0f7cd3c7a2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^4.0.0
</details>

<details><summary>vault: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/vault-v3.2.0...vault-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Features

* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>wait-for-ok: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/wait-for-ok-v3.2.0...wait-for-ok-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
</details>

<details><summary>webpack: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.2.0...webpack-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* move webpack options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move webpack options to task options and allow configuring env ([9f85554](https://github.com/Financial-Times/dotcom-tool-kit/commit/9f85554362cbbf4c2207e61165cf5d0ae1e0dc01))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))


### Code Refactoring

* rename Task#options to pluginOptions ([1eee853](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eee8535c7984e07235f93e8a9b0a3081ad68b4e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
</details>

<details><summary>dotcom-tool-kit: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/dotcom-tool-kit-v3.4.5...dotcom-tool-kit-v4.0.0) (2024-04-30)


###   BREAKING CHANGES

* **cli:** drop cosmiconfig and load .toolkitrc.yml at plugin's root
* drop support for Node 16
* only load plugins if their toolkitrc version matches the current version
* load hook installations from options.hooks
* rename SchemaOptions to PluginOptions
* move plugin options to a sub key of toolkitrc options entries
* move base classes into their own package
* rename Hook#check to Hook#isInstalled
* instantiate a separate hook instance per hook installation request from configs
* make plugin loading even lazier by having separate entrypoints for each task and hook
* rename `hooks` in toolkitrc to `commands`
* remove legacy circleci postinstall backwards compatibility
* rearchitect plugin loader to lazily load plugins

### Features

* add a Base subclass for init functions ([4cc0833](https://github.com/Financial-Times/dotcom-tool-kit/commit/4cc08332cd4901c66c482d72c252a7053b6641ce))
* add command for printing the full config, useful for debugging ([3816e69](https://github.com/Financial-Times/dotcom-tool-kit/commit/3816e69c3e7bbcd2de246786fdad6c6e3c934f17))
* add support for a managesFiles entry in hook installs fields ([e0e9b05](https://github.com/Financial-Times/dotcom-tool-kit/commit/e0e9b055decf3b0ca39caf49de7931f444b9f505))
* allow hook classes to specify an options schema ([2b884bf](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b884bfd607d5df6e3190b40ab9fa3c225d4572c))
* allow loading old-style options fields with a warning ([34d28e6](https://github.com/Financial-Times/dotcom-tool-kit/commit/34d28e66db69f59882c64bfb3f4d28efc9bda7cd))
* allow plugins to specify init entrypoints ([f46c5cb](https://github.com/Financial-Times/dotcom-tool-kit/commit/f46c5cbaa4905fac55cd368bb8a6f7ef9d388911))
* allow specifying command task options in a toolkitrc ([bb091c8](https://github.com/Financial-Times/dotcom-tool-kit/commit/bb091c8d78ee8e71441c51da3f2e9a8d273ffeee))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* better formatting for missing commands ([3d70ae1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3d70ae19871078c35fcd11c63ef64bcb31cf133e))
* better group --help output ([72f0d2e](https://github.com/Financial-Times/dotcom-tool-kit/commit/72f0d2e1025c22a50c1010310f817206be32f4cb))
* **cli:** add support for tags in config that resolve based on options ([e8cd1b8](https://github.com/Financial-Times/dotcom-tool-kit/commit/e8cd1b8614fe3b92d583b3d093976c433b246e4b))
* **cli:** allow key fields in YAML to be substituted by options too ([66767ec](https://github.com/Financial-Times/dotcom-tool-kit/commit/66767ecc462c64ccc19a2dd4cfbc0cf048f814bc))
* **cli:** drop cosmiconfig and load .toolkitrc.yml at plugin's root ([058b0ee](https://github.com/Financial-Times/dotcom-tool-kit/commit/058b0ee3c35f76565b8bbdba3014ac7015f61f5c))
* **cli:** gather all YAML tag errors into Validated before throwing ([78eed8e](https://github.com/Financial-Times/dotcom-tool-kit/commit/78eed8e77555727becf71ca64009b384224f151b))
* collect and store the hook-managed files in config ([731e55d](https://github.com/Financial-Times/dotcom-tool-kit/commit/731e55d3930f348a4e1f3b6da5b33b78ea65f89d))
* **core:** run hook checks when running tasks if files have changed ([f3dfad4](https://github.com/Financial-Times/dotcom-tool-kit/commit/f3dfad4da47cdf788dc4299d465177c8e1504523))
* explicitly handle legacy plugin options ([afc8d54](https://github.com/Financial-Times/dotcom-tool-kit/commit/afc8d54561bba42b133716c62e4b120dde27d8df))
* load hook installations from options.hooks ([2f0c2b6](https://github.com/Financial-Times/dotcom-tool-kit/commit/2f0c2b68e6668fdbcc14c88458243f7377eefe39))
* load hook options from rc files and put them in config ([293e3e4](https://github.com/Financial-Times/dotcom-tool-kit/commit/293e3e474a4722fe7f290f56890a7ff2d6c3253b))
* load hooks in toolkitrc as commands and warn about it ([75ed6f4](https://github.com/Financial-Times/dotcom-tool-kit/commit/75ed6f414dfb42b4feb132e66481d5ba20629445))
* load plugin rcfile task options into config ([e749170](https://github.com/Financial-Times/dotcom-tool-kit/commit/e749170d67a82064d205b7304b536c6c06a633c5))
* make plugin loading even lazier by having separate entrypoints for each task and hook ([c66ec83](https://github.com/Financial-Times/dotcom-tool-kit/commit/c66ec83ab9ab9560b3e2835b559cada0e89b3020))
* merge in options from the command task when parsing task options ([5a24e14](https://github.com/Financial-Times/dotcom-tool-kit/commit/5a24e14bd12f93cb3f7b5d5da9ebb639a87699eb))
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move conflict into its own package ([7d0765a](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d0765ac8268ad60602055c7ac0c7750fa31c7f9))
* move plugin options to a sub key of toolkitrc options entries ([9eaa9b0](https://github.com/Financial-Times/dotcom-tool-kit/commit/9eaa9b0475a471769d5b86fe103139aadfd6e8a6))
* move validated into its own package ([4068b37](https://github.com/Financial-Times/dotcom-tool-kit/commit/4068b371b4ddcac10302412132665b0f7cd3c7a2))
* only load plugins if their toolkitrc version matches the current version ([3c98760](https://github.com/Financial-Times/dotcom-tool-kit/commit/3c987609092a629e3000b43f8c5fdb4592ffc789))
* overhaul help output for new abstractions & config structure ([e513389](https://github.com/Financial-Times/dotcom-tool-kit/commit/e513389d4a60ed54b3562dc7c8aad23dae81431d))
* read list of files to hash from config ([1159be1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1159be17ffca3ab6a8a4fdf68be1b23d0e3e23aa))
* reduce hook installations based on logic from hook classes themselves ([afe8b71](https://github.com/Financial-Times/dotcom-tool-kit/commit/afe8b71436e948f75123338aae5eb1d72da198c8))
* reïntroduce validating plugins when we load them ([7bcc0a5](https://github.com/Financial-Times/dotcom-tool-kit/commit/7bcc0a59cf7a6d8a1425b89502c61fe4af9e102d))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* run init classes before install and runTasks ([68704a8](https://github.com/Financial-Times/dotcom-tool-kit/commit/68704a8653ef046f2c19b44a94d41b0b6ca5abca))
* run init classes before install and runTasks ([80b673f](https://github.com/Financial-Times/dotcom-tool-kit/commit/80b673f2d8f3f155ab354a95128c4454afa4e64a))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* validate task option conflicts and unused task options ([4e6caea](https://github.com/Financial-Times/dotcom-tool-kit/commit/4e6caea404d07798ea14f0dea599fb08cb9ca601))
* various help formatting and working tweaks idk ([5073668](https://github.com/Financial-Times/dotcom-tool-kit/commit/50736684687080074ec9d0f7082039e83d51d877))


### Bug Fixes

* allow tasks with schemas not to have options provided in the config ([2a9a69a](https://github.com/Financial-Times/dotcom-tool-kit/commit/2a9a69a9ff8d292cd0802fb0ee7711709afa7174))
* check ids for resolved plugins not plugin options ([3eff1cf](https://github.com/Financial-Times/dotcom-tool-kit/commit/3eff1cfb60578614a9d89c21d8c12da9e3659478))
* **cli:** allow default option values to be read by YAML tags ([493994b](https://github.com/Financial-Times/dotcom-tool-kit/commit/493994b910c8e3ada443c32f2502f6387fa5e719))
* **cli:** avoid hook installation conflicts between niblings ([9d9274a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d9274ab19197283315efc68d4b466bd826f3388))
* **cli:** only override child options for hooks of the same class ([e722631](https://github.com/Financial-Times/dotcom-tool-kit/commit/e72263194fddc5f46dd0e71c66cbaaf35495d9f1))
* **cli:** print something when hook installations are conflicting ([0fb1f4a](https://github.com/Financial-Times/dotcom-tool-kit/commit/0fb1f4a11c7c93d584891e555b8caeb7e79b0e4c))
* fix error message for conflicting tasks and hooks ([28b0e89](https://github.com/Financial-Times/dotcom-tool-kit/commit/28b0e890994bb267c878da0109a14a16fc7fbdc5))
* look in config.commandTasks for defined commands, not config.hooks = ([83c4594](https://github.com/Financial-Times/dotcom-tool-kit/commit/83c4594932c9ed9ad798613c79842e3856c57baa))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))
* only load the tasks that are needed for the hooks that are running ([074a691](https://github.com/Financial-Times/dotcom-tool-kit/commit/074a691fcca53b40d38613fc70cbcfb709ed394d))
* remove check for undefined commands ([2017d0c](https://github.com/Financial-Times/dotcom-tool-kit/commit/2017d0c39ba998abc1b1ff0136b02d1cc83c5d15))
* remove conflicts from task options in valid config type ([27b5783](https://github.com/Financial-Times/dotcom-tool-kit/commit/27b5783fcbab9df2018757f4ea06178ceac74c78))
* throw if there are task option conflicts ([2b0ccad](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b0ccadcdc8e5ffb773b84c3ae4aedf31a75c4d1))
* undefined commands logging ([033af0b](https://github.com/Financial-Times/dotcom-tool-kit/commit/033af0b36e961fd59a44bf819716643f33b7f82b))
* use resolve-from for entrypoints as resolve-pkg expects a package.json ([92a4c00](https://github.com/Financial-Times/dotcom-tool-kit/commit/92a4c0081f50df5472096ca401665431ed3b4995))


### Performance Improvements

* **core:** selectively load core modules based on subcommand ([3781371](https://github.com/Financial-Times/dotcom-tool-kit/commit/3781371a97c6ce1dd07e7c023069ae5313638b50))
* rearchitect plugin loader to lazily load plugins ([d0df633](https://github.com/Financial-Times/dotcom-tool-kit/commit/d0df63395f0cede5b4050dfef5e4b5f705a771b0))


### Miscellaneous Chores

* drop support for Node 16 ([6b5d149](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b5d149446c07b9e9ef105ecbc3c0137a6f45ebe))
* remove legacy circleci postinstall backwards compatibility ([84f26a5](https://github.com/Financial-Times/dotcom-tool-kit/commit/84f26a54eca7465e7ddebf4315858805bffa1938))


### Code Refactoring

* instantiate a separate hook instance per hook installation request from configs ([8e763f0](https://github.com/Financial-Times/dotcom-tool-kit/commit/8e763f0463126847ac2cbe17f3ff9c362a3026b5))
* rename Hook#check to Hook#isInstalled ([a3db11a](https://github.com/Financial-Times/dotcom-tool-kit/commit/a3db11acfb7f529f0e138543f3b35e5577a634e1))
* rename SchemaOptions to PluginOptions ([7de8626](https://github.com/Financial-Times/dotcom-tool-kit/commit/7de862654fe2ca474ddfd6b28bc133a4de17c803))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^3.2.0 to ^4.0.0
  * devDependencies
    * @dotcom-tool-kit/babel bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/backend-heroku-app bumped from ^3.1.4 to ^4.0.0
    * @dotcom-tool-kit/circleci bumped from ^6.0.1 to ^7.0.0
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.3 to ^4.0.0
    * @dotcom-tool-kit/eslint bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/frontend-app bumped from ^3.2.4 to ^4.0.0
    * @dotcom-tool-kit/heroku bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/mocha bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/n-test bumped from ^3.3.1 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.1 to ^4.0.0
    * @dotcom-tool-kit/webpack bumped from ^3.2.0 to ^4.0.0
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).