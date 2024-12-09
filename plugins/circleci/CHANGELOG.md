# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.2.0 to ^2.3.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/types bumped from ^2.3.0 to ^2.4.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.4.0 to ^2.5.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/types bumped from ^2.5.0 to ^2.5.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.1 to ^2.8.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.0 to ^2.9.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.1 to ^2.9.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.2 to ^2.10.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.1.0 to ^3.1.1
    * @dotcom-tool-kit/types bumped from ^3.2.0 to ^3.3.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.0 to ^3.3.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.3.1 to ^3.4.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.1.0 to ^3.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.2.0 to ^3.3.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/types bumped from ^3.6.0 to ^3.6.1

## [7.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v7.0.2...circleci-v7.1.0) (2024-12-09)


### Features

* **circleci:** allow plugins to only specify a subset of hook options ([c39850a](https://github.com/Financial-Times/dotcom-tool-kit/commit/c39850a4df4884bd3141288b3c2bf583c276a65c))
* **circleci:** allow workflow job options to be merged ([e33e579](https://github.com/Financial-Times/dotcom-tool-kit/commit/e33e579fe33a48ea1485a56f92da39e9818d56dc))


### Bug Fixes

* add cypressImage to circleci schema ([f09078e](https://github.com/Financial-Times/dotcom-tool-kit/commit/f09078e1b70ad8f6f4281ac317c99a4a078503e8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.0.0 to ^1.1.0
    * @dotcom-tool-kit/error bumped from ^4.0.0 to ^4.0.1
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.1 to ^1.2.0

## [7.0.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v7.0.1...circleci-v7.0.2) (2024-10-04)


### Bug Fixes

* **circleci:** allow workflows with different jobs to be merged ([8c97d7d](https://github.com/Financial-Times/dotcom-tool-kit/commit/8c97d7d34cee831d567fb64c2228c48fe29554a8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^4.0.1 to ^4.0.2
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.0 to ^1.1.1

## [7.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v7.0.0...circleci-v7.0.1) (2024-09-16)


### Bug Fixes

* **circleci:** remove leftover references to deleted waiting-for-approval ([4ed4634](https://github.com/Financial-Times/dotcom-tool-kit/commit/4ed46345c88e5e85ae29472605f29b9ab3383772))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.0.0 to ^1.1.0

## [7.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v6.0.3...circleci-v7.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

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

## [6.0.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v6.0.2...circleci-v6.0.3) (2024-07-22)


### Bug Fixes

* **circleci:** don't run review jobs on tagged releases ([0e000ce](https://github.com/Financial-Times/dotcom-tool-kit/commit/0e000ce75fda8d3015373e782596ab445970a16d))

## [6.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v6.0.0...circleci-v6.0.1) (2024-02-28)


### Bug Fixes

* **circleci:** remove unneeded filters property from nightly builds ([8080636](https://github.com/Financial-Times/dotcom-tool-kit/commit/808063617988dbf8cf2213641e91318c58b0dce7))
* **circleci:** use omit to remove the filters property from nightly jobs ([f955768](https://github.com/Financial-Times/dotcom-tool-kit/commit/f955768948a6a96c566b5cd23e8cfaa524fd184a))

## [6.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.4.1...circleci-v6.0.0) (2024-01-25)


### ⚠ BREAKING CHANGES

* **circleci:** Bump MAJOR_ORB_VERSION to 5, which adds the teardown:review hook into the e2e-test-review jobA

### Bug Fixes

* **circleci:** Bump MAJOR_ORB_VERSION to 5, which adds the teardown:review hook into the e2e-test-review jobA ([19b5b09](https://github.com/Financial-Times/dotcom-tool-kit/commit/19b5b091016fb483e0e4aa93fda0a090ca97ad43))
* **circleci:** update circleci snapshot test ([bd9b3a5](https://github.com/Financial-Times/dotcom-tool-kit/commit/bd9b3a5542410e9368d3cff4a3107333f5107d79))

## [5.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.3.9...circleci-v5.4.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/state bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [5.3.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.3.2...circleci-v5.3.3) (2023-06-05)


### Bug Fixes

* **circleci:** never append executor name to approval job ([604e530](https://github.com/Financial-Times/dotcom-tool-kit/commit/604e530a1789f285b09dc66a7d9dd08fc0112dc2))

## [5.3.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.3.1...circleci-v5.3.2) (2023-05-31)


### Bug Fixes

* **circleci:** don't include executor setting twice for nightly jobs ([567ba24](https://github.com/Financial-Times/dotcom-tool-kit/commit/567ba24cc56247d6dee0db871171dd910c4db2fe))

## [5.3.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.3.0...circleci-v5.3.1) (2023-05-31)


### Bug Fixes

* **circleci:** don't depend on all Node versions for joining jobs ([304418b](https://github.com/Financial-Times/dotcom-tool-kit/commit/304418b3196581ac33f2b849a02f72c6a0fe7987))

## [5.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.2.0...circleci-v5.3.0) (2023-05-30)


### Features

* **circleci:** add default value for CircleCI's node version option ([ab5ce94](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab5ce94441983693d3849ee42cf0f1c30fcff67e))
* **circleci:** add support for multiple Node versions ([10b15f4](https://github.com/Financial-Times/dotcom-tool-kit/commit/10b15f42f603c232293e15d05d4a062d7f855dbb))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.1.0 to ^3.2.0

## [5.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.1.1...circleci-v5.2.0) (2023-05-16)


### Features

* **circleci:** provide diff for what's missing in CircleCI config ([7eddd1b](https://github.com/Financial-Times/dotcom-tool-kit/commit/7eddd1b1d6bf86b203c3b6936f140c90ce8e5906))


### Bug Fixes

* **circleci:** check that the base configuration matches the user's too ([5b07706](https://github.com/Financial-Times/dotcom-tool-kit/commit/5b07706dcb9d4d7a7fc37e3127b2d155fa710250))

## [5.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.1.0...circleci-v5.1.1) (2023-05-02)


### Bug Fixes

* **circleci:** revert default version of node used in CircleCI config ([ae418fc](https://github.com/Financial-Times/dotcom-tool-kit/commit/ae418fcc3869d44db3963758fe79151275fd4568))

## [5.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v5.0.0...circleci-v5.1.0) (2023-04-28)


### Features

* **circleci:** bump default version of node used in CircleCI config ([5820ca5](https://github.com/Financial-Times/dotcom-tool-kit/commit/5820ca5b3945a98f4a17ca5150b253135ed1989d))
* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Bug Fixes

* **circleci:** update majorOrbVersion to new published major version ([b6f9b11](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6f9b111b934ef05269a1458ec9a2cc2fbc2a030))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/state bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v4.0.4...circleci-v5.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^3.0.0
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [4.0.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v4.0.2...circleci-v4.0.3) (2023-03-29)


### Bug Fixes

* **circleci:** correct installation error for unmanaged CircleCI configs ([df22de6](https://github.com/Financial-Times/dotcom-tool-kit/commit/df22de622b76fabf4d598a739b15a5eb0b585257))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v3.0.2...circleci-v4.0.0) (2023-03-07)


### ⚠ BREAKING CHANGES

* **circleci:** rewrite CircleCI plugin to allow more flexible hooks

### Features

* **circleci:** rewrite CircleCI plugin to allow more flexible hooks ([b60c309](https://github.com/Financial-Times/dotcom-tool-kit/commit/b60c30921e62bab563a408600c31ff777c3f272b))


### Bug Fixes

* **circleci:** bump orb major version used when installing CircleCI ([423c6a0](https://github.com/Financial-Times/dotcom-tool-kit/commit/423c6a082c923b031264a3c8f142303adafe2935))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [3.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v3.0.0...circleci-v3.0.1) (2022-12-14)


### Bug Fixes

* **circle:** remove filter job options from nightly jobs ([1c94b6a](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c94b6afc6c9748e910b8d49474df1b105120db0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.2.0
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.1.7...circleci-v3.0.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* **circleci:** share state between circleci install hooks

### Features

* **circleci-heroku:** add support for using a Cypress docker image ([59f914a](https://github.com/Financial-Times/dotcom-tool-kit/commit/59f914aefdb7beae5e8ea0fac314efbc7194d802))
* **circleci:** add new error wording to circleci plugin ([5552c67](https://github.com/Financial-Times/dotcom-tool-kit/commit/5552c675720eea7df76c3434849e8487055296d9))
* **circleci:** only print jobs that are missing in error ([c75c3ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/c75c3ad6d91fbc5779d2a3fbed853f474babfad0))
* **circleci:** share state between circleci install hooks ([fb04ccc](https://github.com/Financial-Times/dotcom-tool-kit/commit/fb04ccca5d5681609ce273a62f54de1f2cf86082))


### Performance Improvements

* improve lodash tree shaking ([454f9cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/454f9cd9984162141c7318165d723593295db678))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.7.0

### [2.1.7](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.1.6...circleci-v2.1.7) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v2.0.0...circleci-v2.1.0) (2022-06-07)


### Features

* implement the new scheduled pipeline config in toolkit circleci hooks ([13ef342](https://github.com/Financial-Times/dotcom-tool-kit/commit/13ef342d62994a833f43c559bf1fc8772c945030))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/circleci-v1.9.0...circleci-v2.0.0) (2022-04-19)


### Bug Fixes

* don't assume version numbers in code ([b4ea80d](https://github.com/Financial-Times/dotcom-tool-kit/commit/b4ea80da7d831979541a28f26f28b4496eeaa5fe))


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/state bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
