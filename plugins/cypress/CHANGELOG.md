# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/vault bumped from ^3.1.3 to ^3.1.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/vault bumped from ^3.1.4 to ^3.1.5

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/vault bumped from ^3.1.5 to ^3.1.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.7 to ^1.0.8

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.8 to ^1.0.9
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^3.2.0 to ^3.3.0

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v4.0.1...cypress-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

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
* move base classes into their own package ([6cc09b5](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cc09b5a0afb136810f8e9fa45dea7aa0a10d830))
* move cypress localUrl plugin option to a url task option and change precedence ([e9d11ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9d11ef13ac83e567d049aa66f2878eb77d3de1c))
* rename `hooks` in toolkitrc to `commands` ([91daa0e](https://github.com/Financial-Times/dotcom-tool-kit/commit/91daa0e13ebe5440fbdd5783c2b7eead5f588a22))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))


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
    * @dotcom-tool-kit/state bumped from ^3.3.0 to ^4.0.0

## [4.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v4.0.0...cypress-v4.0.1) (2024-02-12)


### Bug Fixes

* **cypress:** use correct name when logging Cypress URL in CI ([ffb3214](https://github.com/Financial-Times/dotcom-tool-kit/commit/ffb3214bb742897311e24fbe0e9876c6ad913289))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v3.4.1...cypress-v4.0.0) (2024-02-08)


### ⚠ BREAKING CHANGES

* **cypress:** allow Tool Kit options to override Doppler secrets

### Bug Fixes

* **cypress:** allow Tool Kit options to override Doppler secrets ([1358b73](https://github.com/Financial-Times/dotcom-tool-kit/commit/1358b73b7b9b34bd9aa406cd5b11a0acd12a31be))

## [3.4.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v3.3.2...cypress-v3.4.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/doppler bumped from ^1.0.9 to ^1.1.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/state bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v3.2.3...cypress-v3.3.0) (2023-11-22)


### Features

* **cypress:** add Doppler support ([5c14dc1](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c14dc131a3ffbf78ba828b8c6c0622a4040e85d))


### Bug Fixes

* **cypress:** add missing dependencies to package.json ([3facfee](https://github.com/Financial-Times/dotcom-tool-kit/commit/3facfee01050c1dd88a5aeedfe0b2afbc4e37b47))

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v3.1.0...cypress-v3.2.0) (2023-08-29)


### Features

* **cypress:** pull vault env variables in local hook ([bf76edf](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf76edf7fe6323e2c7bbc25ffc5184cee2f6ea22))

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v3.0.0...cypress-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v2.0.1...cypress-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))

## [2.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/cypress-v2.0.0...cypress-v2.0.1) (2023-03-07)


### Bug Fixes

* tidy up references in tsconfig files ([159b602](https://github.com/Financial-Times/dotcom-tool-kit/commit/159b6021e93922ebe6e4ca74297ad7a1c93290b3))

## 2.0.0 (2022-12-08)


### Features

* **cypress:** add plugin for running cypress locally and in the CI ([870a50b](https://github.com/Financial-Times/dotcom-tool-kit/commit/870a50b107bfa1f1846d35ba074fd3088cc63563))


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))
