# Changelog

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.0.0 to ^1.1.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.0 to ^1.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.0.0 to ^1.1.0
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.1 to ^1.2.0

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.2.0...package-json-hook-v5.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

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

## [4.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.1.0...package-json-hook-v4.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.0.0...package-json-hook-v4.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v3.0.0...package-json-hook-v4.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v2.1.1...package-json-hook-v3.0.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* **package-json-hook:** share state for package.json hook installers

### Features

* **package-json-hook:** share state for package.json hook installers ([0c8729f](https://github.com/Financial-Times/dotcom-tool-kit/commit/0c8729fc80f9b423189a2ae0e6aa87382b2663a8))

### [2.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v2.1.0...package-json-hook-v2.1.1) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v2.0.0...package-json-hook-v2.1.0) (2022-05-03)


### Features

* remove hook package and move PackageJsonHelper into package-json-hook ([b22e5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/b22e5d36ebfdc50cfa57586489a1107e35631bcc))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v1.9.0...package-json-hook-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/hook bumped from ^1.9.0 to ^2.0.0
