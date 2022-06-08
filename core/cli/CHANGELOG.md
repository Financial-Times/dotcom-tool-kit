# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/backend-app bumped from ^2.0.3 to ^2.0.4
    * @dotcom-tool-kit/heroku bumped from ^2.0.2 to ^2.0.3
    * @dotcom-tool-kit/circleci-heroku bumped from ^2.0.3 to ^2.0.4
    * @dotcom-tool-kit/frontend-app bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/eslint bumped from ^2.1.0 to ^2.1.1

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/dotcom-tool-kit-v2.1.0...dotcom-tool-kit-v2.2.0) (2022-06-07)


### Features

* add --listPlugins option ([2db53ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/2db53ca2b14d307644beda46c86114645a1aa285))


### Bug Fixes

* **core:** improve loadToolKitRC typing and defaults ([efc05fb](https://github.com/Financial-Times/dotcom-tool-kit/commit/efc05fb3e0c0abac74d5545d5a10ff18e04439cb))
* move config plugin assignment earlier to prevent race condition ([5beb1a8](https://github.com/Financial-Times/dotcom-tool-kit/commit/5beb1a8c6c8ec6490285e2ea857e1874e0d13efa))
* skip resolving plugins that have been resolved already ([bb51635](https://github.com/Financial-Times/dotcom-tool-kit/commit/bb516357b420619f6a2135323f340ea4a54ad1b7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^2.0.1 to ^2.0.2
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0
  * devDependencies
    * @dotcom-tool-kit/backend-app bumped from ^2.0.0 to ^2.0.3
    * @dotcom-tool-kit/heroku bumped from ^2.0.0 to ^2.0.2
    * @dotcom-tool-kit/webpack bumped from ^2.0.0 to ^2.1.1
    * @dotcom-tool-kit/babel bumped from ^2.0.0 to ^2.0.2
    * @dotcom-tool-kit/circleci bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/npm bumped from ^2.0.0 to ^2.0.3
    * @dotcom-tool-kit/circleci-heroku bumped from ^2.0.0 to ^2.0.3
    * @dotcom-tool-kit/frontend-app bumped from ^2.0.0 to ^2.1.1
    * @dotcom-tool-kit/eslint bumped from ^2.0.0 to ^2.1.0
    * @dotcom-tool-kit/mocha bumped from ^2.0.0 to ^2.0.2
    * @dotcom-tool-kit/n-test bumped from ^2.0.0 to ^2.0.2

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/dotcom-tool-kit-v2.0.0...dotcom-tool-kit-v2.1.0) (2022-05-03)


### Features

* remove hook package and move PackageJsonHelper into package-json-hook ([b22e5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/b22e5d36ebfdc50cfa57586489a1107e35631bcc))


### Bug Fixes

* ensure we correctly consider conflicts from cousin plugins ([0a38996](https://github.com/Financial-Times/dotcom-tool-kit/commit/0a389967f6b1f2181e2d76935392c4b1a658c27b))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/dotcom-tool-kit-v1.9.0...dotcom-tool-kit-v2.0.0) (2022-04-19)


### Bug Fixes

* **cli:** remove CircleCI plugin dependency ([1c2aafe](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c2aafe4d598ba9dc4b15ae5b5fab355adf37e5f))


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/hook bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/options bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/wait-for-ok bumped from ^1.9.0 to ^2.0.0
