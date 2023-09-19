# Changelog

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
