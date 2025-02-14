# Changelog

## [4.3.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v4.3.0...state-v4.3.1) (2025-02-14)


### Bug Fixes

* use a new "docker" state for pushed images ([b0b9350](https://github.com/Financial-Times/dotcom-tool-kit/commit/b0b9350128faa5a2eef644a264da527c39fd93f5))
* use nullish coalescing operators ([85510f5](https://github.com/Financial-Times/dotcom-tool-kit/commit/85510f583f1cd6b4c80908c3f26b5bb249384249))

## [4.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v4.2.0...state-v4.3.0) (2025-02-04)


### Features

* allow storing AWS credentials in CI state ([9ec28e0](https://github.com/Financial-Times/dotcom-tool-kit/commit/9ec28e03925433afbeb87eccd154c3b8ee58d920))

## [4.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v4.1.0...state-v4.2.0) (2025-01-27)


### Features

* store pushed Docker images in state ([ade6eba](https://github.com/Financial-Times/dotcom-tool-kit/commit/ade6eba1f9c76796936f8d6aae66687a55578555))

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v4.0.0...state-v4.1.0) (2025-01-02)


### Features

* add support for Node 22 ([df20e7c](https://github.com/Financial-Times/dotcom-tool-kit/commit/df20e7c455a16eeb3e75a2e940c93848d618a218))
* remove npm engine field ([aec1c78](https://github.com/Financial-Times/dotcom-tool-kit/commit/aec1c78aedb8f26a43b25824eb19e30101806182))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.3.0...state-v4.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

* remove serverless buildNumVariable in favour of populating it via CI state
* drop support for Node 16

### Features

* **core:** run hook checks when running tasks if files have changed ([cd2bf67](https://github.com/Financial-Times/dotcom-tool-kit/commit/cd2bf67ffb7b431cc1a8e6ecd977de330bec952d))
* read list of files to hash from config ([d386ced](https://github.com/Financial-Times/dotcom-tool-kit/commit/d386ced40bdace1525f46aa4337d1037f2d7fcc6))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))


### Miscellaneous Chores

* drop support for Node 16 ([ab95982](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab95982635e255fec49d08af9894c2833a36500e))

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.2.0...state-v3.3.0) (2024-01-23)


### Features

* pass serverless stageName through review state ([7228d17](https://github.com/Financial-Times/dotcom-tool-kit/commit/7228d17001221fe46df0d89025654298baac2533))

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.1.1...state-v3.2.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))

## [3.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.1.0...state-v3.1.1) (2023-10-03)


### Bug Fixes

* **n-test:** support randomised Heroku subdomains ([8a0ffe1](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a0ffe112664461dbbcab18a5c73d7562bddd478))

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v3.0.0...state-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v2.0.1...state-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))

### [2.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v2.0.0...state-v2.0.1) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/state-v1.9.0...state-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))
