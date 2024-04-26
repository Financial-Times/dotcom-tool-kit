# Changelog

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/package-json-hook-v4.2.0...package-json-hook-v5.0.0) (2024-04-26)


### ⚠ BREAKING CHANGES

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
