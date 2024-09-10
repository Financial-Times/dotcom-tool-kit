:robot: I have created a release *beep* *boop*
---


<details><summary>babel: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/babel-v3.2.1...babel-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* move babel options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move babel options to task options and allow configuring env ([d5b25a2](https://github.com/Financial-Times/dotcom-tool-kit/commit/d5b25a25e705e3311428eda1694a9a3b2541c630))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>backend-heroku-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/backend-heroku-app-v3.1.6...backend-heroku-app-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.5 to ^4.0.0
    * @dotcom-tool-kit/heroku bumped from ^3.4.2 to ^4.0.0
    * @dotcom-tool-kit/node bumped from ^3.4.2 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.2 to ^4.0.0
</details>

<details><summary>backend-serverless-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/backend-serverless-app-v3.2.9...backend-serverless-app-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-deploy bumped from ^3.4.5 to ^4.0.0
    * @dotcom-tool-kit/node bumped from ^3.4.2 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.2 to ^4.0.0
    * @dotcom-tool-kit/serverless bumped from ^2.4.5 to ^3.0.0
</details>

<details><summary>base: 1.0.0</summary>

## 1.0.0 (2024-09-10)


###   BREAKING CHANGES

* pass task files in as part of a run context object
* rename Task#options to pluginOptions
* move base classes into their own package

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>circleci: 7.0.0</summary>

## [7.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v6.0.3...circleci-v7.0.0) (2024-09-10)


###   BREAKING CHANGES

* remove backwards compatibility-preserving hacks
* remove serverless buildNumVariable in favour of populating it via CI state
* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* rename Hook#check to Hook#isInstalled
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* add list of files that CircleCI and package.json hooks manage ([f51c75a](https://github.com/Financial-Times/dotcom-tool-kit/commit/f51c75acbd095415556b225c31fbcd8e5c742951))
* add support for a managesFiles entry in hook installs fields ([a89b167](https://github.com/Financial-Times/dotcom-tool-kit/commit/a89b167da9dae6edd6fcc9295a5f8f82e2e30023))
* allow hook classes to specify an options schema ([01433a7](https://github.com/Financial-Times/dotcom-tool-kit/commit/01433a7d6081c11640adea87a05df18d5a53060a))
* **circleci:** allow projects to rewrite whole CircleCI config ([58a96c0](https://github.com/Financial-Times/dotcom-tool-kit/commit/58a96c047497fa3b82914a73db1ad9c17de1ab7a))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* **circleci:** don't generate matrices if only one Node version used ([2136545](https://github.com/Financial-Times/dotcom-tool-kit/commit/21365452f307891cce888cad00aac74ce2603a9d))
* **circleci:** remove waiting-for-approval job ([d6b6714](https://github.com/Financial-Times/dotcom-tool-kit/commit/d6b67147217cafed6c0c669e0ea953c13e9146d0))
* export CircleCiConfig hook ([cda5e20](https://github.com/Financial-Times/dotcom-tool-kit/commit/cda5e20db4fbcf38db65b9bc42fb93b2e300dd78))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* overhaul help output for new abstractions & config structure ([7d98205](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d982053c67bee0d4c7131821313cf20bfc0f8b7))
* remove backwards compatibility-preserving hacks ([dc008ff](https://github.com/Financial-Times/dotcom-tool-kit/commit/dc008ff156054a5fa61b4e7b4b8bdd638d6ab57f))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))


### Bug Fixes

* **circleci:** don't run review jobs on tagged releases ([f373212](https://github.com/Financial-Times/dotcom-tool-kit/commit/f373212518183be7841205a6aed7c0c5a96ef747))
* **circleci:** use correct name for jobs in a matrix ([b22afe2](https://github.com/Financial-Times/dotcom-tool-kit/commit/b22afe28c015a380c36304182a029444ac61dcca))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Code Refactoring

* rename Hook#check to Hook#isInstalled ([c00691b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c00691b4c3994c6fae2aec7fc2c4ada44b2168ac))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>circleci-deploy: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-deploy-v3.4.5...circleci-deploy-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* **pa11y:** remove deprecated plugin
* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **circleci-deploy:** define Cypress and Serverless options with tags ([6ee5f3c](https://github.com/Financial-Times/dotcom-tool-kit/commit/6ee5f3cf309a87723c19802fd00dd5b2a991313a))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* **pa11y:** remove deprecated plugin ([dd755f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/dd755f878bb71239d91a04a1095d75d0c78c32f7))


### Bug Fixes

* **circleci-deploy:** add missing Serverless options to deploy-review job ([733b182](https://github.com/Financial-Times/dotcom-tool-kit/commit/733b18218bc082d4bba62dc763d7ed7db9313134))
* **circleci-deploy:** remove unused option from e2e-test-review job ([530a687](https://github.com/Financial-Times/dotcom-tool-kit/commit/530a687a074ccd0b1733fef379935629aba68bac))
* **circleci:** don't run review jobs on tagged releases ([f373212](https://github.com/Financial-Times/dotcom-tool-kit/commit/f373212518183be7841205a6aed7c0c5a96ef747))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.3 to ^7.0.0
</details>

<details><summary>circleci-npm: 6.0.0</summary>

## [6.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-npm-v5.3.5...circleci-npm-v6.0.0) (2024-09-10)


###   BREAKING CHANGES

* **circleci:** define CircleCI configs in .toolkitrc.yml
* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci bumped from ^6.0.3 to ^7.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.2 to ^4.0.0
</details>

<details><summary>component: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/component-v4.1.5...component-v5.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package

### Features

* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/circleci-npm bumped from ^5.3.5 to ^6.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.2 to ^4.0.0
</details>

<details><summary>config: 1.0.0</summary>

## 1.0.0 (2024-09-10)


###   BREAKING CHANGES

* rename SchemaOptions to PluginOptions

### Features

* **cli:** add support for tags in config that resolve based on options ([8df97b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/8df97b9e6d595740d4b94f34fe5a3f0dccef0994))
* collect and store the hook-managed files in config ([190afc5](https://github.com/Financial-Times/dotcom-tool-kit/commit/190afc50bdbded129d3e090ebb0e041ba8443b27))
* load plugin rcfile task options into config ([3f1b1b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3f1b1b149e9e5c9c0d00b7f85697469b0ece472a))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))


### Bug Fixes

* **cli:** avoid hook installation conflicts between niblings ([1d70759](https://github.com/Financial-Times/dotcom-tool-kit/commit/1d70759a8139dca5c4d45f6833828914a47e96f0))
* remove conflicts from task options in valid config type ([5c8a1e0](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c8a1e0845eac058d76512d86702bf9805572f55))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([0ce24db](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ce24db808d077a0e4647d3bef9eaf55223a1cdf))
</details>

<details><summary>conflict: 1.0.0</summary>

## 1.0.0 (2024-09-10)


### Features

* move conflict into its own package ([8ab46a0](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ab46a06370d32fd19300fd6a58a775e04a96717))
</details>

<details><summary>create: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/create-v3.8.1...create-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* **vault:** remove references to Vault
* drop support for Node 16
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries
* instantiate a separate hook instance per hook installation request from configs
* make plugin loading even lazier by having separate entrypoints for each task and hook
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow hook classes to specify an options schema ([01433a7](https://github.com/Financial-Times/dotcom-tool-kit/commit/01433a7d6081c11640adea87a05df18d5a53060a))
* allow plugins to specify init entrypoints ([51db8ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/51db8efbbe8172ad35defa2fdd2443075a644f13))
* load hook installations from options.hooks ([aaf1160](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaf1160a4724b07b9d174f9d237721368d2fa087))
* load plugin rcfile task options into config ([3f1b1b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3f1b1b149e9e5c9c0d00b7f85697469b0ece472a))
* make plugin loading even lazier by having separate entrypoints for each task and hook ([b4760c2](https://github.com/Financial-Times/dotcom-tool-kit/commit/b4760c24fe588ee1dc4ad74f4649ee802067e4b8))
* move plugin options to a sub key of toolkitrc options entries ([4748eb1](https://github.com/Financial-Times/dotcom-tool-kit/commit/4748eb12d60bef31bd6da00d1447e35af1e0af1a))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Bug Fixes

* **create:** no longer need to clean cosmiconfig as we've dropped it ([bee11ec](https://github.com/Financial-Times/dotcom-tool-kit/commit/bee11ec46c25bf9474ea89d4de075de2a984a5d4))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* instantiate a separate hook instance per hook installation request from configs ([34f9a41](https://github.com/Financial-Times/dotcom-tool-kit/commit/34f9a41e8a137bac6d55a0c021c0a9ed9db74e65))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
  * devDependencies
    * dotcom-tool-kit bumped from ^3.5.2 to ^4.0.0
</details>

<details><summary>cypress: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v4.0.2...cypress-v5.0.0) (2024-09-10)


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

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* consolidate cypress tasks using similar logic to n-test for urls ([efbfd2b](https://github.com/Financial-Times/dotcom-tool-kit/commit/efbfd2b41fe016e7bad5a175a2255cb799f0fe29))
* **cypress:** add PackageJson hook options ([1cbc98d](https://github.com/Financial-Times/dotcom-tool-kit/commit/1cbc98d49a82c182a204af7dd9b74f93d8062451))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move cypress localUrl plugin option to a url task option and change precedence ([89a5514](https://github.com/Financial-Times/dotcom-tool-kit/commit/89a551494dafed20e87d640b929dc342f445c9ec))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>doppler: 2.0.0</summary>

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.1.1...doppler-v2.0.0) (2024-09-10)


###   BREAKING CHANGES

* **vault:** remove references to Vault
* drop support for Node 16

### Features

* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
</details>

<details><summary>error: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/error-v3.2.0...error-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
</details>

<details><summary>eslint: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/eslint-v3.2.2...eslint-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* pass task files in as part of a run context object
* move eslint plugin options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* add configPath option for eslint task ([1c9ebd1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c9ebd14d051ee624051707076a4eb9d84eef190))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move eslint plugin options to task options ([22a17ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/22a17adab5cce411b105bcdae802e78bb5c17e37))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>frontend-app: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/frontend-app-v3.2.6...frontend-app-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* rename `hooks` in toolkitrc to `commands`

### Features

* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/backend-heroku-app bumped from ^3.1.6 to ^4.0.0
    * @dotcom-tool-kit/upload-assets-to-s3 bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/webpack bumped from ^3.2.1 to ^4.0.0
</details>

<details><summary>heroku: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/heroku-v3.4.2...heroku-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* **heroku:** remove systemCode option
* **vault:** remove references to Vault
* split heroku options into plugin-wide and heroku production task-specific
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* **heroku:** add PackageJson hook options ([71de5db](https://github.com/Financial-Times/dotcom-tool-kit/commit/71de5db8ed4a60936e0f190644119a242f1c5620))
* **heroku:** remove systemCode option ([be00602](https://github.com/Financial-Times/dotcom-tool-kit/commit/be00602133549c551f8a79bcbb57f9a723ae9e7c))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split heroku options into plugin-wide and heroku production task-specific ([bf6fcf3](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf6fcf39e26f4fca3a63cc677b63a18674aea7b9))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Bug Fixes

* **heroku:** use correct casing for Heroku API response field ([f889b75](https://github.com/Financial-Times/dotcom-tool-kit/commit/f889b75469dc6a89885ac5a8932aac90315189e7))
* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/npm bumped from ^3.3.2 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>husky-npm: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/husky-npm-v4.2.0...husky-npm-v5.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* delete the husky hook
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **husky-npm:** add PackageJson hook options ([b8f40dc](https://github.com/Financial-Times/dotcom-tool-kit/commit/b8f40dc3fa7e339252bdb5607bc8f43a5ff63c4b))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* delete the husky hook ([8162c20](https://github.com/Financial-Times/dotcom-tool-kit/commit/8162c20d7ad425cb2d4405a518d09305134327e8))
* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>jest: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/jest-v3.4.1...jest-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* change jest "mode" option to a boolean "ci" option
* move jest options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* change jest "mode" option to a boolean "ci" option ([ca6f2d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/ca6f2d4f525fd8528ab0b758ba9c1adc09bbd59a))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move jest options to task options and allow configuring env ([686f84c](https://github.com/Financial-Times/dotcom-tool-kit/commit/686f84cd30b9e8f022fa7d740cfee4c226e37da8))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>lint-staged: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-v4.2.1...lint-staged-v5.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>lint-staged-npm: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/lint-staged-npm-v3.2.1...lint-staged-npm-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* **lint-staged-npm:** add PackageJson hook options ([a594afd](https://github.com/Financial-Times/dotcom-tool-kit/commit/a594afd5dbc8fab5682874595db4cc78df12ab3c))


### Bug Fixes

* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/husky-npm bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/lint-staged bumped from ^4.2.1 to ^5.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>logger: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.4.1...logger-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16

### Features

* better group --help output ([7e22938](https://github.com/Financial-Times/dotcom-tool-kit/commit/7e229382a683757c38bba78fd9bb3c1cd3edde34))
* overhaul help output for new abstractions & config structure ([7d98205](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d982053c67bee0d4c7131821313cf20bfc0f8b7))
* various help formatting and working tweaks idk ([77efbdb](https://github.com/Financial-Times/dotcom-tool-kit/commit/77efbdb325f224df3c2cf16521ea66de7defc8c1))


### Bug Fixes

* explicitly set error etc mark forgrounds to black for better contrast ([b1a305a](https://github.com/Financial-Times/dotcom-tool-kit/commit/b1a305a67ce9c6d9776d98e50ba6334a1049b415))
* remove stray unicode variant selector in error mark ([7f52222](https://github.com/Financial-Times/dotcom-tool-kit/commit/7f52222a8b3d7f084a5d77af45fee89cd7516f59))
* switch from upstream boxen to my fork ([d32dc65](https://github.com/Financial-Times/dotcom-tool-kit/commit/d32dc653fc574698dc92cb8bbd5202affbccc0d1))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
</details>

<details><summary>mocha: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/mocha-v3.2.1...mocha-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* move mocha options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move mocha options to task options ([073d737](https://github.com/Financial-Times/dotcom-tool-kit/commit/073d737795f3828ff96b6623cde7d4908c7e48f3))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>n-test: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/n-test-v3.3.2...n-test-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* remove backwards compatibility-preserving hacks
* move n-test options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move n-test options to task options ([72dee47](https://github.com/Financial-Times/dotcom-tool-kit/commit/72dee475a9442f26e23192f26f064d8febb843a4))
* remove backwards compatibility-preserving hacks ([dc008ff](https://github.com/Financial-Times/dotcom-tool-kit/commit/dc008ff156054a5fa61b4e7b4b8bdd638d6ab57f))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>next-router: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/next-router-v3.4.2...next-router-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>node: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/node-v3.4.2...node-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* rename node useVault option to useDoppler
* move node options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* make ports optional in node and nodemon tasks ([aa01fb6](https://github.com/Financial-Times/dotcom-tool-kit/commit/aa01fb6d8000858efd02164f84243f2e2e2d04fb))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move node options to task options ([8a8729c](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a8729c9e38ac4777774058b3153f0ce4a9b448a))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* rename node useVault option to useDoppler ([f39d0fe](https://github.com/Financial-Times/dotcom-tool-kit/commit/f39d0fea8c51259806e70e6a9f1327abcb56a625))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
</details>

<details><summary>nodemon: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.4.2...nodemon-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* rename nodemon useVault option to useDoppler
* move nodemon options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* make ports optional in node and nodemon tasks ([aa01fb6](https://github.com/Financial-Times/dotcom-tool-kit/commit/aa01fb6d8000858efd02164f84243f2e2e2d04fb))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move nodemon options to task options ([de5568c](https://github.com/Financial-Times/dotcom-tool-kit/commit/de5568cbf7d6bedd37f43e46e3d4cedc15ca66d6))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* rename nodemon useVault option to useDoppler ([b80de5e](https://github.com/Financial-Times/dotcom-tool-kit/commit/b80de5e4adf2dd4dca312001c31202075bc7ac28))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
</details>

<details><summary>npm: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/npm-v3.3.2...npm-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* remove all current concrete hook subclasses
* rearchitect plugin loader to lazily load plugins

### Features

* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))
* **npm:** add PackageJson hook options ([c71ab23](https://github.com/Financial-Times/dotcom-tool-kit/commit/c71ab231e3b08424caa2be8987f84b3efff07f40))


### Bug Fixes

* make npm publish error messages CI-agnostic ([aa4cc6f](https://github.com/Financial-Times/dotcom-tool-kit/commit/aa4cc6f707fedc624684316cccd5f79322ea0eb1))
* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>options: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/options-v3.2.1...options-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* rename SchemaOptions to PluginOptions

### Features

* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([0ce24db](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ce24db808d077a0e4647d3bef9eaf55223a1cdf))
</details>

<details><summary>package-json-hook: 5.0.0</summary>

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.2.0...package-json-hook-v5.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16
* move base classes into their own package
* rename Hook#check to Hook#isInstalled

### Features

* add list of files that CircleCI and package.json hooks manage ([f51c75a](https://github.com/Financial-Times/dotcom-tool-kit/commit/f51c75acbd095415556b225c31fbcd8e5c742951))
* add support for a managesFiles entry in hook installs fields ([a89b167](https://github.com/Financial-Times/dotcom-tool-kit/commit/a89b167da9dae6edd6fcc9295a5f8f82e2e30023))
* allow hook classes to specify an options schema ([01433a7](https://github.com/Financial-Times/dotcom-tool-kit/commit/01433a7d6081c11640adea87a05df18d5a53060a))
* implement options for packagejson hook ([9182ff6](https://github.com/Financial-Times/dotcom-tool-kit/commit/9182ff67cc443c837e200c34c49a97f3b49148e9))
* implement PackageJson.overrideChildInstallations ([001e9ce](https://github.com/Financial-Times/dotcom-tool-kit/commit/001e9ce4bf4e556216b483dccc199736f18994ad))
* implement PackageJsonHook.mergeChildInstallations ([becb741](https://github.com/Financial-Times/dotcom-tool-kit/commit/becb741498c0a125d0df699c5abf7b49b75dde28))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move conflict into its own package ([8ab46a0](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ab46a06370d32fd19300fd6a58a775e04a96717))
* move package-json-hook to plugins and export PackageJson hook ([56336e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/56336e5cebb93c375dcaf28682f95f3da5b26c8a))
* overhaul help output for new abstractions & config structure ([7d98205](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d982053c67bee0d4c7131821313cf20bfc0f8b7))
* **package-json-hook:** allow full stops to be escaped so they aren't split as paths ([cb5e591](https://github.com/Financial-Times/dotcom-tool-kit/commit/cb5e591368081e2752e1fc91cfb9edd5c7a5cdb3))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* support trailing string in packagejson options ([2eaee9c](https://github.com/Financial-Times/dotcom-tool-kit/commit/2eaee9cc30fa00a777a658df5654d495780a130c))


### Bug Fixes

* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))
* **package-json-hook:** fix isInstalled check so it handles split paths ([e2066b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/e2066b1b5807674f4dfb45525e8d9b0fe4eadf44))
* **package-json-hook:** handle other kinds of command options ([af3dba0](https://github.com/Financial-Times/dotcom-tool-kit/commit/af3dba0faf9d50b334f305ceed86a2a06669db63))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Hook#check to Hook#isInstalled ([c00691b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c00691b4c3994c6fae2aec7fc2c4ada44b2168ac))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
</details>

<details><summary>plugin: 1.0.0</summary>

## 1.0.0 (2024-09-10)


###   BREAKING CHANGES

* only load plugins if their toolkitrc version matches the current version
* load hook installations from options.hooks
* move plugin options to a sub key of toolkitrc options entries

### Features

* add support for a managesFiles entry in hook installs fields ([a89b167](https://github.com/Financial-Times/dotcom-tool-kit/commit/a89b167da9dae6edd6fcc9295a5f8f82e2e30023))
* allow specifying command task options in a toolkitrc ([7b8bc00](https://github.com/Financial-Times/dotcom-tool-kit/commit/7b8bc000b8562eb0dbd00eb2f8f3fc5fab71a57b))
* load hook installations from options.hooks ([aaf1160](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaf1160a4724b07b9d174f9d237721368d2fa087))
* load plugin rcfile task options into config ([3f1b1b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3f1b1b149e9e5c9c0d00b7f85697469b0ece472a))
* move plugin options to a sub key of toolkitrc options entries ([4748eb1](https://github.com/Financial-Times/dotcom-tool-kit/commit/4748eb12d60bef31bd6da00d1447e35af1e0af1a))
* only load plugins if their toolkitrc version matches the current version ([65b3403](https://github.com/Financial-Times/dotcom-tool-kit/commit/65b3403b8369aa09ec64b11d20ab44b06d468d86))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
</details>

<details><summary>prettier: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.2.1...prettier-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* pass task files in as part of a run context object
* remove prettier configOptions option
* move prettier options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* remove all current concrete hook subclasses
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move prettier options to task options ([71c24af](https://github.com/Financial-Times/dotcom-tool-kit/commit/71c24af0b1517008f530ce0ece85ccb9018e5100))
* **prettier:** add PackageJson hook options ([8895c3d](https://github.com/Financial-Times/dotcom-tool-kit/commit/8895c3d8f7908a6d611d912f8b3cc3ecfa85f2d9))
* remove prettier configOptions option ([6b143d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b143d43de921ae2ba66008ddeab83e3ea52d8ce))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Bug Fixes

* **prettier:** correct hook option field in config ([bba2a99](https://github.com/Financial-Times/dotcom-tool-kit/commit/bba2a996f95874655154dc9723933f0f2f56ece8))
* require package-json-hook plugin in plugins that use PackageJson hook ([892a4a6](https://github.com/Financial-Times/dotcom-tool-kit/commit/892a4a60c1f8641068cdf0bf3449bf1052c0556d))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove all current concrete hook subclasses ([62e7dc6](https://github.com/Financial-Times/dotcom-tool-kit/commit/62e7dc6d953efb9fa877143e77707cccee25d844))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0
</details>

<details><summary>schemas: 1.0.0</summary>

## 1.0.0 (2024-09-10)


###   BREAKING CHANGES

* remove backwards compatibility-preserving hacks
* **heroku:** remove systemCode option
* **vault:** remove references to Vault
* **pa11y:** remove deprecated plugin
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

* add (empty) schema exports for task schemas ([c17365e](https://github.com/Financial-Times/dotcom-tool-kit/commit/c17365e082b6d3ffbd3404ffdcf5ec1db9193207))
* add configPath option for eslint task ([1c9ebd1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c9ebd14d051ee624051707076a4eb9d84eef190))
* add watch, noEmit and build options to typescript task ([8ac8551](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ac855173a7b814d7736bde62171695b799b51e6))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* change jest "mode" option to a boolean "ci" option ([ca6f2d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/ca6f2d4f525fd8528ab0b758ba9c1adc09bbd59a))
* **circleci:** allow projects to rewrite whole CircleCI config ([58a96c0](https://github.com/Financial-Times/dotcom-tool-kit/commit/58a96c047497fa3b82914a73db1ad9c17de1ab7a))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* consolidate typescript tasks and move options to task options ([b8a6c34](https://github.com/Financial-Times/dotcom-tool-kit/commit/b8a6c34cf5a73480167155e7b66316698588a6b0))
* explicitly handle legacy plugin options ([8574516](https://github.com/Financial-Times/dotcom-tool-kit/commit/8574516114a02731c77b877c7f6fb3d550434971))
* **heroku:** remove systemCode option ([be00602](https://github.com/Financial-Times/dotcom-tool-kit/commit/be00602133549c551f8a79bcbb57f9a723ae9e7c))
* **lint-staged-npm:** add PackageJson hook options ([a594afd](https://github.com/Financial-Times/dotcom-tool-kit/commit/a594afd5dbc8fab5682874595db4cc78df12ab3c))
* make ports optional in node and nodemon tasks ([aa01fb6](https://github.com/Financial-Times/dotcom-tool-kit/commit/aa01fb6d8000858efd02164f84243f2e2e2d04fb))
* move babel options to task options and allow configuring env ([d5b25a2](https://github.com/Financial-Times/dotcom-tool-kit/commit/d5b25a25e705e3311428eda1694a9a3b2541c630))
* move cypress localUrl plugin option to a url task option and change precedence ([89a5514](https://github.com/Financial-Times/dotcom-tool-kit/commit/89a551494dafed20e87d640b929dc342f445c9ec))
* move eslint plugin options to task options ([22a17ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/22a17adab5cce411b105bcdae802e78bb5c17e37))
* move jest options to task options and allow configuring env ([686f84c](https://github.com/Financial-Times/dotcom-tool-kit/commit/686f84cd30b9e8f022fa7d740cfee4c226e37da8))
* move mocha options to task options ([073d737](https://github.com/Financial-Times/dotcom-tool-kit/commit/073d737795f3828ff96b6623cde7d4908c7e48f3))
* move n-test options to task options ([72dee47](https://github.com/Financial-Times/dotcom-tool-kit/commit/72dee475a9442f26e23192f26f064d8febb843a4))
* move node options to task options ([8a8729c](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a8729c9e38ac4777774058b3153f0ce4a9b448a))
* move nodemon options to task options ([de5568c](https://github.com/Financial-Times/dotcom-tool-kit/commit/de5568cbf7d6bedd37f43e46e3d4cedc15ca66d6))
* move pa11y options to task options ([bfd82f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/bfd82f1b188ab9998db254c69134324dd2bbec18))
* move prettier options to task options ([71c24af](https://github.com/Financial-Times/dotcom-tool-kit/commit/71c24af0b1517008f530ce0ece85ccb9018e5100))
* move serverless run ports and useDoppler options to task options ([e5791ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/e5791ada3518213ad6a8df9f59dbcf2c3c65f68d))
* move upload-assets-to-s3 options to task options ([664f519](https://github.com/Financial-Times/dotcom-tool-kit/commit/664f5196c57db79b18ecbfdb6e3cf50ea151af84))
* move webpack options to task options and allow configuring env ([658c9bb](https://github.com/Financial-Times/dotcom-tool-kit/commit/658c9bb2b78843318da943e00e1a8fe2ef7bb4a9))
* **pa11y:** remove deprecated plugin ([dd755f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/dd755f878bb71239d91a04a1095d75d0c78c32f7))
* remove backwards compatibility-preserving hacks ([dc008ff](https://github.com/Financial-Times/dotcom-tool-kit/commit/dc008ff156054a5fa61b4e7b4b8bdd638d6ab57f))
* remove prettier configOptions option ([6b143d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b143d43de921ae2ba66008ddeab83e3ea52d8ce))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))
* remove typescript extraArgs option ([00b9a8b](https://github.com/Financial-Times/dotcom-tool-kit/commit/00b9a8b8b9b857803f825d0ec0b9cdbf553f1508))
* rename node useVault option to useDoppler ([f39d0fe](https://github.com/Financial-Times/dotcom-tool-kit/commit/f39d0fea8c51259806e70e6a9f1327abcb56a625))
* rename nodemon useVault option to useDoppler ([b80de5e](https://github.com/Financial-Times/dotcom-tool-kit/commit/b80de5e4adf2dd4dca312001c31202075bc7ac28))
* rename serverless useVault option to useDoppler ([7e0dfb3](https://github.com/Financial-Times/dotcom-tool-kit/commit/7e0dfb38299987890e322762126c1f078b2e1fd4))
* split heroku options into plugin-wide and heroku production task-specific ([bf6fcf3](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf6fcf39e26f4fca3a63cc677b63a18674aea7b9))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **upload-assets-to-s3:** remove legacy environment variable handling ([9217fd8](https://github.com/Financial-Times/dotcom-tool-kit/commit/9217fd8589ec902968694ed9c851521f67f587ba))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Bug Fixes

* **circleci:** don't run review jobs on tagged releases ([f373212](https://github.com/Financial-Times/dotcom-tool-kit/commit/f373212518183be7841205a6aed7c0c5a96ef747))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([0ce24db](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ce24db808d077a0e4647d3bef9eaf55223a1cdf))
</details>

<details><summary>serverless: 3.0.0</summary>

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/serverless-v2.4.5...serverless-v3.0.0) (2024-09-10)


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

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move serverless run ports and useDoppler options to task options ([e5791ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/e5791ada3518213ad6a8df9f59dbcf2c3c65f68d))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))
* rename serverless useVault option to useDoppler ([7e0dfb3](https://github.com/Financial-Times/dotcom-tool-kit/commit/7e0dfb38299987890e322762126c1f078b2e1fd4))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove unused legacy vault/doppler support from serverless deploy/provision/teardown tasks ([007038d](https://github.com/Financial-Times/dotcom-tool-kit/commit/007038d1b018c47b99971d9713cd4375be488712))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/doppler bumped from ^1.1.1 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0
</details>

<details><summary>state: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.3.0...state-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* remove serverless buildNumVariable in favour of populating it via CI state
* drop support for Node 16

### Features

* **core:** run hook checks when running tasks if files have changed ([cd2bf67](https://github.com/Financial-Times/dotcom-tool-kit/commit/cd2bf67ffb7b431cc1a8e6ecd977de330bec952d))
* read list of files to hash from config ([d386ced](https://github.com/Financial-Times/dotcom-tool-kit/commit/d386ced40bdace1525f46aa4337d1037f2d7fcc6))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
</details>

<details><summary>typescript: 3.0.0</summary>

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.3.0...typescript-v3.0.0) (2024-09-10)


###   BREAKING CHANGES

* remove typescript extraArgs option
* consolidate typescript tasks and move options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* add new lazy plugin spec to rest of plugins

### Features

* add watch, noEmit and build options to typescript task ([8ac8551](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ac855173a7b814d7736bde62171695b799b51e6))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* consolidate typescript tasks and move options to task options ([b8a6c34](https://github.com/Financial-Times/dotcom-tool-kit/commit/b8a6c34cf5a73480167155e7b66316698588a6b0))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* remove typescript extraArgs option ([00b9a8b](https://github.com/Financial-Times/dotcom-tool-kit/commit/00b9a8b8b9b857803f825d0ec0b9cdbf553f1508))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Bug Fixes

* **typescript:** point config to correct module path for task ([0b3b7cf](https://github.com/Financial-Times/dotcom-tool-kit/commit/0b3b7cfc88b4acc52c893b9d0a112de6add237b4))


### Performance Improvements

* add new lazy plugin spec to rest of plugins ([5367c9a](https://github.com/Financial-Times/dotcom-tool-kit/commit/5367c9a3e086412c28939c88700b67cb04afcfcd))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>upload-assets-to-s3: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v3.2.1...upload-assets-to-s3-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* **upload-assets-to-s3:** remove legacy environment variable handling
* move upload-assets-to-s3 options to task options
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move upload-assets-to-s3 options to task options ([664f519](https://github.com/Financial-Times/dotcom-tool-kit/commit/664f5196c57db79b18ecbfdb6e3cf50ea151af84))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **upload-assets-to-s3:** remove legacy environment variable handling ([9217fd8](https://github.com/Financial-Times/dotcom-tool-kit/commit/9217fd8589ec902968694ed9c851521f67f587ba))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>validated: 1.0.0</summary>

## 1.0.0 (2024-09-10)


### Features

* move validated into its own package ([a8ed591](https://github.com/Financial-Times/dotcom-tool-kit/commit/a8ed59131bc603ed01fd8672646b3c5d75c77bde))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^4.0.0
</details>

<details><summary>wait-for-ok: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/wait-for-ok-v3.2.0...wait-for-ok-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* drop support for Node 16

### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
</details>

<details><summary>webpack: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/webpack-v3.2.1...webpack-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* move webpack options to task options and allow configuring env
* drop support for Node 16
* rename Task#options to pluginOptions
* move base classes into their own package
* rename `hooks` in toolkitrc to `commands`
* rearchitect plugin loader to lazily load plugins

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move webpack options to task options and allow configuring env ([658c9bb](https://github.com/Financial-Times/dotcom-tool-kit/commit/658c9bb2b78843318da943e00e1a8fe2ef7bb4a9))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))


### Performance Improvements

* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))


### Code Refactoring

* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
</details>

<details><summary>dotcom-tool-kit: 4.0.0</summary>

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/dotcom-tool-kit-v3.5.2...dotcom-tool-kit-v4.0.0) (2024-09-10)


###   BREAKING CHANGES

* pass task files in as part of a run context object
* **heroku:** remove systemCode option
* **vault:** remove references to Vault
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

* add a Base subclass for init functions ([0f05227](https://github.com/Financial-Times/dotcom-tool-kit/commit/0f0522773dd5544840efb1c7832b04f0eeebfc43))
* add command for printing the full config, useful for debugging ([9a6762e](https://github.com/Financial-Times/dotcom-tool-kit/commit/9a6762ecbdfdba1af9dac71028d5acbc986d1f88))
* add support for a managesFiles entry in hook installs fields ([a89b167](https://github.com/Financial-Times/dotcom-tool-kit/commit/a89b167da9dae6edd6fcc9295a5f8f82e2e30023))
* allow hook classes to specify an options schema ([01433a7](https://github.com/Financial-Times/dotcom-tool-kit/commit/01433a7d6081c11640adea87a05df18d5a53060a))
* allow loading old-style options fields with a warning ([f451444](https://github.com/Financial-Times/dotcom-tool-kit/commit/f451444a14a4274fe3ff652f82bad90897877bcb))
* allow plugins to specify init entrypoints ([51db8ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/51db8efbbe8172ad35defa2fdd2443075a644f13))
* allow specifying command task options in a toolkitrc ([7b8bc00](https://github.com/Financial-Times/dotcom-tool-kit/commit/7b8bc000b8562eb0dbd00eb2f8f3fc5fab71a57b))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* better formatting for missing commands ([77daf5f](https://github.com/Financial-Times/dotcom-tool-kit/commit/77daf5fc0f4502039260d218e8c6ed9143471d15))
* better group --help output ([7e22938](https://github.com/Financial-Times/dotcom-tool-kit/commit/7e229382a683757c38bba78fd9bb3c1cd3edde34))
* **cli:** add support for tags in config that resolve based on options ([8df97b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/8df97b9e6d595740d4b94f34fe5a3f0dccef0994))
* **cli:** allow key fields in YAML to be substituted by options too ([172f074](https://github.com/Financial-Times/dotcom-tool-kit/commit/172f074a12062a0bc225c9ad0f52b00cdecd1acf))
* **cli:** drop cosmiconfig and load .toolkitrc.yml at plugin's root ([87d7cbb](https://github.com/Financial-Times/dotcom-tool-kit/commit/87d7cbb905a4a1406ab1f4f6ae222a9d225fe05d))
* **cli:** gather all YAML tag errors into Validated before throwing ([82b2061](https://github.com/Financial-Times/dotcom-tool-kit/commit/82b206128cee71ad7cba65acfa130731ac5f2313))
* collect and store the hook-managed files in config ([190afc5](https://github.com/Financial-Times/dotcom-tool-kit/commit/190afc50bdbded129d3e090ebb0e041ba8443b27))
* **core:** run hook checks when running tasks if files have changed ([cd2bf67](https://github.com/Financial-Times/dotcom-tool-kit/commit/cd2bf67ffb7b431cc1a8e6ecd977de330bec952d))
* explicitly handle legacy plugin options ([8574516](https://github.com/Financial-Times/dotcom-tool-kit/commit/8574516114a02731c77b877c7f6fb3d550434971))
* **heroku:** remove systemCode option ([be00602](https://github.com/Financial-Times/dotcom-tool-kit/commit/be00602133549c551f8a79bcbb57f9a723ae9e7c))
* load hook installations from options.hooks ([aaf1160](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaf1160a4724b07b9d174f9d237721368d2fa087))
* load hook options from rc files and put them in config ([dcea77a](https://github.com/Financial-Times/dotcom-tool-kit/commit/dcea77a64445e4851b64470e1478215e8142e6b5))
* load hooks in toolkitrc as commands and warn about it ([d779c01](https://github.com/Financial-Times/dotcom-tool-kit/commit/d779c0151c874a89564b56e9e54155cb0f69fb90))
* load plugin rcfile task options into config ([3f1b1b1](https://github.com/Financial-Times/dotcom-tool-kit/commit/3f1b1b149e9e5c9c0d00b7f85697469b0ece472a))
* make plugin loading even lazier by having separate entrypoints for each task and hook ([b4760c2](https://github.com/Financial-Times/dotcom-tool-kit/commit/b4760c24fe588ee1dc4ad74f4649ee802067e4b8))
* merge in options from the command task when parsing task options ([30ad103](https://github.com/Financial-Times/dotcom-tool-kit/commit/30ad1037d0b8e5120f1a66a8e8392d9cd3a1a277))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* move conflict into its own package ([8ab46a0](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ab46a06370d32fd19300fd6a58a775e04a96717))
* move plugin options to a sub key of toolkitrc options entries ([4748eb1](https://github.com/Financial-Times/dotcom-tool-kit/commit/4748eb12d60bef31bd6da00d1447e35af1e0af1a))
* move validated into its own package ([a8ed591](https://github.com/Financial-Times/dotcom-tool-kit/commit/a8ed59131bc603ed01fd8672646b3c5d75c77bde))
* only load plugins if their toolkitrc version matches the current version ([65b3403](https://github.com/Financial-Times/dotcom-tool-kit/commit/65b3403b8369aa09ec64b11d20ab44b06d468d86))
* overhaul help output for new abstractions & config structure ([7d98205](https://github.com/Financial-Times/dotcom-tool-kit/commit/7d982053c67bee0d4c7131821313cf20bfc0f8b7))
* read list of files to hash from config ([d386ced](https://github.com/Financial-Times/dotcom-tool-kit/commit/d386ced40bdace1525f46aa4337d1037f2d7fcc6))
* reduce hook installations based on logic from hook classes themselves ([64b6c0a](https://github.com/Financial-Times/dotcom-tool-kit/commit/64b6c0a42c67a9850cce71d92de7d78138a1cbe0))
* reïntroduce validating plugins when we load them ([b2ebf87](https://github.com/Financial-Times/dotcom-tool-kit/commit/b2ebf87af75f346bb732c0c5fad4f1cedafbfc9c))
* rename `hooks` in toolkitrc to `commands` ([45baa66](https://github.com/Financial-Times/dotcom-tool-kit/commit/45baa66b231a1e39332187cd3b8fdc36bec9727d))
* run init classes before install and runTasks ([420749e](https://github.com/Financial-Times/dotcom-tool-kit/commit/420749e54ebc2cab9a67fe3b97db9f851fa78b85))
* run init classes before install and runTasks ([be2d494](https://github.com/Financial-Times/dotcom-tool-kit/commit/be2d494ccc24724a2c62d2d4fe888a980baf82bf))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* validate task option conflicts and unused task options ([977c92d](https://github.com/Financial-Times/dotcom-tool-kit/commit/977c92debe8c91a90e022c638fac5ad10cff3913))
* various help formatting and working tweaks idk ([77efbdb](https://github.com/Financial-Times/dotcom-tool-kit/commit/77efbdb325f224df3c2cf16521ea66de7defc8c1))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Bug Fixes

* allow multiple instances of task with different options ([f50c14e](https://github.com/Financial-Times/dotcom-tool-kit/commit/f50c14ed13c52c81c3f56cf6ffabf7a8b0987cfe))
* allow tasks with schemas not to have options provided in the config ([a10f04d](https://github.com/Financial-Times/dotcom-tool-kit/commit/a10f04d89aa24effbe3d74e4cd144aa46e07566e))
* check ids for resolved plugins not plugin options ([f27e3f3](https://github.com/Financial-Times/dotcom-tool-kit/commit/f27e3f3addc113311c91168200653045852dc044))
* **cli:** allow default option values to be read by YAML tags ([f6fef04](https://github.com/Financial-Times/dotcom-tool-kit/commit/f6fef04ac3d9ea72c709f569749ba20951247c6d))
* **cli:** avoid hook installation conflicts between niblings ([1d70759](https://github.com/Financial-Times/dotcom-tool-kit/commit/1d70759a8139dca5c4d45f6833828914a47e96f0))
* **cli:** don't throw when command not declared ([b0e047d](https://github.com/Financial-Times/dotcom-tool-kit/commit/b0e047d381bfec9d8788fb15f7dde8adc0bcc713))
* **cli:** only override child options for hooks of the same class ([e9ce8b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9ce8b5ed4c8a910c09fe9eca911a1cf7f09d873))
* **cli:** pass through task options when no schema found ([026048e](https://github.com/Financial-Times/dotcom-tool-kit/commit/026048e3935d28cc23047f7c8edd8f54885e70fa))
* **cli:** print something when hook installations are conflicting ([50024c1](https://github.com/Financial-Times/dotcom-tool-kit/commit/50024c172e628a5dff8b7649f92f3126f2bee2fd))
* **cli:** properly format Zod errors when parsing task options ([2c2419a](https://github.com/Financial-Times/dotcom-tool-kit/commit/2c2419a7d1367d807df06c22687b1a92b6ee9872))
* **cli:** resolve custom plugins successfully ([10bbf24](https://github.com/Financial-Times/dotcom-tool-kit/commit/10bbf248c6c3a12290248b6186b901cb757ff6e7))
* **cli:** store parsed options for Tasks, not Zod's parsing result ([60840a5](https://github.com/Financial-Times/dotcom-tool-kit/commit/60840a52e17033ab014c1c6ec858a87e9b13ed68))
* fix error message for conflicting tasks and hooks ([073cecc](https://github.com/Financial-Times/dotcom-tool-kit/commit/073ceccad7e93457d578d8f187c055ca7d6b5c31))
* look in config.commandTasks for defined commands, not config.hooks = ([cb00a5a](https://github.com/Financial-Times/dotcom-tool-kit/commit/cb00a5af82d35299fafe5540526742fe23ac4f8e))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))
* only load the tasks that are needed for the hooks that are running ([3c30cec](https://github.com/Financial-Times/dotcom-tool-kit/commit/3c30cecd49d6e910a4962766f91cad7e4c8b8a86))
* remove check for undefined commands ([992b20f](https://github.com/Financial-Times/dotcom-tool-kit/commit/992b20f8e30816b35def91b9666509c358691d0a))
* remove conflicts from task options in valid config type ([5c8a1e0](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c8a1e0845eac058d76512d86702bf9805572f55))
* throw if there are task option conflicts ([7162580](https://github.com/Financial-Times/dotcom-tool-kit/commit/7162580e4ecd03c77379d4e06ead2f32912d8016))
* undefined commands logging ([8334ffb](https://github.com/Financial-Times/dotcom-tool-kit/commit/8334ffb6d6ffce4a2ad6e440c473ae7b8620a18d))
* use resolve-from for entrypoints as resolve-pkg expects a package.json ([957fc06](https://github.com/Financial-Times/dotcom-tool-kit/commit/957fc062665891a5971910da171f1d0d10697752))


### Performance Improvements

* **core:** selectively load core modules based on subcommand ([20dd046](https://github.com/Financial-Times/dotcom-tool-kit/commit/20dd046987a9bdb1fa1b7f91a84ac07c3a58b6e0))
* rearchitect plugin loader to lazily load plugins ([9779b83](https://github.com/Financial-Times/dotcom-tool-kit/commit/9779b83d8dbfdcf904229790658daa05ef6c1f8f))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))
* remove legacy circleci postinstall backwards compatibility ([d16d437](https://github.com/Financial-Times/dotcom-tool-kit/commit/d16d4373dbe9fe7c19611643ad771af48a622f5c))


### Code Refactoring

* instantiate a separate hook instance per hook installation request from configs ([34f9a41](https://github.com/Financial-Times/dotcom-tool-kit/commit/34f9a41e8a137bac6d55a0c021c0a9ed9db74e65))
* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Hook#check to Hook#isInstalled ([c00691b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c00691b4c3994c6fae2aec7fc2c4ada44b2168ac))
* rename SchemaOptions to PluginOptions ([0ce24db](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ce24db808d077a0e4647d3bef9eaf55223a1cdf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^3.4.1 to ^1.0.0
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.1 to ^4.0.0
    * @dotcom-tool-kit/options bumped from ^3.2.1 to ^4.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^3.2.0 to ^4.0.0
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).