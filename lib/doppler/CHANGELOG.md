# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^3.2.0 to ^3.3.0
    * @dotcom-tool-kit/options bumped from ^3.1.4 to ^3.1.5
    * @dotcom-tool-kit/types bumped from ^3.4.0 to ^3.4.1
    * @dotcom-tool-kit/vault bumped from ^3.1.5 to ^3.1.6

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
