# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.0.0 to ^2.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.1.0 to ^2.2.0

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
    * @dotcom-tool-kit/logger bumped from ^2.1.2 to ^2.2.0
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1

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
    * @dotcom-tool-kit/types bumped from ^3.1.0 to ^3.2.0

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
    * @dotcom-tool-kit/logger bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.2.0...prettier-v4.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

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
* remove prettier configOptions option ([06f358e](https://github.com/Financial-Times/dotcom-tool-kit/commit/06f358e71f8d62ae58fe05527621ac001dcdff4b))
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
    * @dotcom-tool-kit/error bumped from ^3.2.0 to ^4.0.0
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^4.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.2.0 to ^5.0.0

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.1.6...prettier-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.1.0 to ^4.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v3.0.0...prettier-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/package-json-hook bumped from ^4.0.0 to ^4.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.2.3...prettier-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^3.0.0 to ^4.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.1.3...prettier-v2.2.0) (2023-03-07)


### Features

* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [2.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.1.0...prettier-v2.1.1) (2022-12-08)


### Bug Fixes

* **prettier:** remove config for json files ([b6149df](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6149df746449662577225c264fc93654cf222c9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.0.9...prettier-v2.1.0) (2022-11-09)


### Features

* add jsx,json,tsx and ts file types to prettier defaults ([3bb813b](https://github.com/Financial-Times/dotcom-tool-kit/commit/3bb813b8ef977d6a9aaa32308dc232ab99619e84))


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/package-json-hook bumped from ^2.1.0 to ^2.1.1
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

### [2.0.9](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v2.0.8...prettier-v2.0.9) (2022-09-21)


### Bug Fixes

* prettier plugin respects .prettierignore ([2a15eab](https://github.com/Financial-Times/dotcom-tool-kit/commit/2a15eab2432cf9b0464bc3c4023f59f136350059))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/prettier-v1.9.0...prettier-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/package-json-hook bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
