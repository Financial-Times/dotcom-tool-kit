# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.2 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

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

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.2.0...typescript-v3.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

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

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.1.7...typescript-v2.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0

## [2.1.6](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.1.5...typescript-v2.1.6) (2023-11-29)


### Bug Fixes

* add default assignment for build:ci for TypescriptBuild ([ca34115](https://github.com/Financial-Times/dotcom-tool-kit/commit/ca34115e626cb1e22fa8d82ddf253713c2ed6fac))
* add default typescriptbuild assignment for build:remote ([a185056](https://github.com/Financial-Times/dotcom-tool-kit/commit/a18505650c02c2056c446d548b8cc11c76186bb1))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v2.0.0...typescript-v2.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.0.0 to ^3.1.0
    * @dotcom-tool-kit/types bumped from ^3.0.0 to ^3.1.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v1.0.5...typescript-v2.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.1 to ^3.0.0
    * @dotcom-tool-kit/types bumped from ^2.10.0 to ^3.0.0

## [1.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/typescript-v1.0.0...typescript-v1.0.1) (2023-01-05)


### Bug Fixes

* correct TypeScript casing ([736cf8e](https://github.com/Financial-Times/dotcom-tool-kit/commit/736cf8e430da2889d92b47752850f820a37d522d))

## 1.0.0 (2023-01-04)


### Features

* **typescript:** add typescript plugin ([0421bdb](https://github.com/Financial-Times/dotcom-tool-kit/commit/0421bdba1f3a56fc8306b8c487433e54b740905c))


### Bug Fixes

* **typescript:** don't block tsc task if watching for file changes ([28e42b0](https://github.com/Financial-Times/dotcom-tool-kit/commit/28e42b054506f1336dab228245a184627dc20975))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.8.0
