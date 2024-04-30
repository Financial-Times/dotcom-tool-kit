# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/vault bumped from ^2.0.0 to ^2.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0
    * @dotcom-tool-kit/vault bumped from ^2.0.1 to ^2.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.2.0 to ^2.3.0
    * @dotcom-tool-kit/vault bumped from ^2.0.2 to ^2.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.3.0 to ^2.4.0
    * @dotcom-tool-kit/vault bumped from ^2.0.3 to ^2.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.4.0 to ^2.5.0
    * @dotcom-tool-kit/vault bumped from ^2.0.4 to ^2.0.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.0 to ^2.5.1
    * @dotcom-tool-kit/vault bumped from ^2.0.5 to ^2.0.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1
    * @dotcom-tool-kit/vault bumped from ^2.0.7 to ^2.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0
    * @dotcom-tool-kit/vault bumped from ^2.0.9 to ^2.0.10

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1
    * @dotcom-tool-kit/vault bumped from ^2.0.10 to ^2.0.11

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.1 to ^2.8.0
    * @dotcom-tool-kit/vault bumped from ^2.0.11 to ^2.0.12

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.0 to ^2.9.1
    * @dotcom-tool-kit/vault bumped from ^2.0.13 to ^2.0.14

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.1 to ^2.9.2
    * @dotcom-tool-kit/vault bumped from ^2.0.14 to ^2.0.15

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.9.2 to ^2.10.0
    * @dotcom-tool-kit/vault bumped from ^2.0.15 to ^2.0.16

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/vault bumped from ^3.1.0 to ^3.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/vault bumped from ^3.1.2 to ^3.1.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.1.0 to ^3.1.1
    * @dotcom-tool-kit/doppler bumped from ^1.0.0 to ^1.0.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.1 to ^1.0.2

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/doppler bumped from ^1.0.2 to ^1.0.3

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.3 to ^1.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.4 to ^1.0.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.5 to ^1.0.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.6 to ^1.0.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.7 to ^1.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0
    * @dotcom-tool-kit/doppler bumped from ^1.0.8 to ^1.0.9

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.2.0 to ^3.3.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.4.1...nodemon-v4.0.0) (2024-04-30)


### ⚠ BREAKING CHANGES

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

## [3.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.3.9...nodemon-v3.4.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/state bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0
    * @dotcom-tool-kit/doppler bumped from ^1.0.9 to ^1.1.0

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.2.1...nodemon-v3.3.0) (2023-09-19)


### Features

* migrate plugins to use Doppler instead of Vault ([e9611ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9611efa3457fbf3ba8d0c00ed6fbb9e0ce203b1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.3.1 to ^3.4.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.1.1...nodemon-v3.2.0) (2023-06-14)


### Features

* disable Node 18's native fetch across all plugins ([ba10618](https://github.com/Financial-Times/dotcom-tool-kit/commit/ba10618f9eb861b8499255fcdb297502e7c42bdf))


### Bug Fixes

* **logger:** don't separate every flush to hooked fork by newline ([368e528](https://github.com/Financial-Times/dotcom-tool-kit/commit/368e52804043f2caa67f1cf9193d09194c5d3c15))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/vault bumped from ^3.1.1 to ^3.1.2

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v3.0.0...nodemon-v3.1.0) (2023-04-28)


### Features

* **nodemon:** disable native fetch in forked node processes ([d946271](https://github.com/Financial-Times/dotcom-tool-kit/commit/d946271d80662812f017a6b2d897535dee9d2ddc))
* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/state bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/vault bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v2.2.3...nodemon-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/state bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0
    * @dotcom-tool-kit/vault bumped from ^2.0.16 to ^3.0.0

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v2.1.5...nodemon-v2.2.0) (2023-03-07)


### Features

* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0
    * @dotcom-tool-kit/vault bumped from ^2.0.12 to ^2.0.13

### [2.1.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v2.1.1...nodemon-v2.1.2) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/state bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2
    * @dotcom-tool-kit/vault bumped from ^2.0.8 to ^2.0.9

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v2.0.7...nodemon-v2.1.0) (2022-09-14)


### Features

* **nodemon:** allow specifying preferred ports ([0aab812](https://github.com/Financial-Times/dotcom-tool-kit/commit/0aab812dfab4eb778c5007eb6ddb2db99a9cc3b2))
* **nodemon:** make vault optional ([9d28d95](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d28d95b7b76fea14741f484d08abc19dc522911))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.5.1 to ^2.6.0
    * @dotcom-tool-kit/vault bumped from ^2.0.6 to ^2.0.7

## [2.0.4](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v2.0.3...nodemon-v2.0.4) (2022-06-29)


### Bug Fixes

* **nodemon:** write chosen port for nodemon too ([7a4c091](https://github.com/Financial-Times/dotcom-tool-kit/commit/7a4c09119652198c71c11331d5f47a58c929b8b9))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/nodemon-v1.9.0...nodemon-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/state bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/vault bumped from ^1.9.0 to ^2.0.0
