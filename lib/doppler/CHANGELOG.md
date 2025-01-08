# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/options bumped from ^3.1.4 to ^3.1.5
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/vault bumped from ^3.1.5 to ^3.1.6

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^3.3.1
    * @dotcom-tool-kit/options bumped from ^3.1.5 to ^3.1.6
    * @dotcom-tool-kit/types bumped from ^3.4.1 to ^3.5.0
    * @dotcom-tool-kit/vault bumped from ^3.1.6 to ^3.1.7

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/options bumped from ^3.2.0 to ^3.2.1
    * @dotcom-tool-kit/types bumped from ^3.6.0 to ^3.6.1
    * @dotcom-tool-kit/vault bumped from ^3.2.0 to ^3.2.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.0.0 to ^1.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/options bumped from ^4.0.1 to ^4.0.2
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.0 to ^1.1.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^4.0.0 to ^4.0.1
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.1.1 to ^1.2.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.2.0 to ^1.3.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.4.0 to ^1.5.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v2.0.4...doppler-v2.1.0) (2025-01-02)


### Features

* add support for Node 22 ([df20e7c](https://github.com/Financial-Times/dotcom-tool-kit/commit/df20e7c455a16eeb3e75a2e940c93848d618a218))
* remove npm engine field ([aec1c78](https://github.com/Financial-Times/dotcom-tool-kit/commit/aec1c78aedb8f26a43b25824eb19e30101806182))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^4.0.1 to ^4.1.0
    * @dotcom-tool-kit/logger bumped from ^4.0.1 to ^4.1.0
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.3.0 to ^1.4.0

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.1.1...doppler-v2.0.0) (2024-09-10)


### ⚠ BREAKING CHANGES

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

## [1.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.9...doppler-v1.1.0) (2024-01-11)


### Features

* add support for Node v20 ([759ac10](https://github.com/Financial-Times/dotcom-tool-kit/commit/759ac10e309885e99f54ae431c301c32ee04f972))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.1.0 to ^3.2.0
    * @dotcom-tool-kit/logger bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/options bumped from ^3.1.6 to ^3.2.0
    * @dotcom-tool-kit/types bumped from ^3.5.0 to ^3.6.0
    * @dotcom-tool-kit/vault bumped from ^3.1.7 to ^3.2.0

## [1.0.8](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.7...doppler-v1.0.8) (2023-11-29)


### Bug Fixes

* **doppler:** improve error message if you try to get secrets in CI ([5b789f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/5b789f8f117c9171504b1f088b6736325729acd1))

## [1.0.7](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.6...doppler-v1.0.7) (2023-11-21)


### Bug Fixes

* **doppler:** don't log that we're falling back to Vault if we aren't ([0e84486](https://github.com/Financial-Times/dotcom-tool-kit/commit/0e844868a1d678b4ce621fcf521853b32a7837c1))
* **doppler:** fix Doppler never falling back to Vault ([12a0018](https://github.com/Financial-Times/dotcom-tool-kit/commit/12a001836c77080ba0db1a6c70098d489059c49d))

## [1.0.6](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.5...doppler-v1.0.6) (2023-10-24)


### Bug Fixes

* **doppler:** avoid calls to Vault if doppler has been configured ([c79428e](https://github.com/Financial-Times/dotcom-tool-kit/commit/c79428eca94368c26a7a2c9228c208c1e41863e2))
* **heroku:** skip config syncing if Vault project flagged as migrated ([0df9f9c](https://github.com/Financial-Times/dotcom-tool-kit/commit/0df9f9c5805555771d0955a0661827f59555621d))

## [1.0.5](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.4...doppler-v1.0.5) (2023-10-23)


### Bug Fixes

* **doppler:** use local doppler executable in CI ([d6f4541](https://github.com/Financial-Times/dotcom-tool-kit/commit/d6f4541f93a92add5947019734a27f0f7b6ed330))

## [1.0.4](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.3...doppler-v1.0.4) (2023-10-23)


### Bug Fixes

* **doppler:** guess Doppler projects with a repo_ name prefix ([0976460](https://github.com/Financial-Times/dotcom-tool-kit/commit/097646068e25daeefd1dfc5ed52e77a1735fd054))

## [1.0.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.1...doppler-v1.0.2) (2023-10-09)


### Bug Fixes

* **doppler:** match new name for production configs in Doppler ([bc5485f](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc5485f56f3d8fcd608885f8fe9ba56a22265783))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/vault bumped from ^3.1.4 to ^3.1.5

## [1.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/doppler-v1.0.0...doppler-v1.0.1) (2023-10-03)


### Bug Fixes

* **heroku:** delegate secrets syncing to Doppler's integration ([767ef82](https://github.com/Financial-Times/dotcom-tool-kit/commit/767ef823ee867a0573ddf3f9f7bfec772319d75b))

## 1.0.0 (2023-09-19)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Features

* **doppler:** add library to get secrets from doppler ([ce51a90](https://github.com/Financial-Times/dotcom-tool-kit/commit/ce51a904cdaffdf8e490e9cc09ad4a2ac14f255b))
* **doppler:** fall back to Vault if Doppler fails ([353e96c](https://github.com/Financial-Times/dotcom-tool-kit/commit/353e96cde61b657248d16440ef495ae491f8542b))


### Bug Fixes

* **doppler:** don't print Vault migration warning message just yet ([034b9cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/034b9cdc08f078966893e79249f2ef4cbd261956))


### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.1.1 to ^3.2.0
    * @dotcom-tool-kit/options bumped from ^3.1.3 to ^3.1.4
    * @dotcom-tool-kit/types bumped from ^3.3.1 to ^3.4.0
    * @dotcom-tool-kit/vault bumped from ^3.1.3 to ^3.1.4
