# Changelog

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
    * @dotcom-tool-kit/types bumped from ^2.6.0 to ^2.6.1

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.7.1 to ^2.8.0

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v2.0.13...upload-assets-to-s3-v2.1.0) (2023-03-07)


### Features

* handle default option values with zod ([7c03517](https://github.com/Financial-Times/dotcom-tool-kit/commit/7c0351771cf1a3d795803295a41dfea755176b19))


### Bug Fixes

* delete default options from plugins' .toolkitrc.yml files ([8a7d0ae](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a7d0ae64d9c5a00acc05aceda867bcc4adec00d))
* **upload-assets-to-s3:** allow setting region for uploads ([89a984d](https://github.com/Financial-Times/dotcom-tool-kit/commit/89a984db001d6388eada79934d16bb9ad75c98e9))
* **upload-assets-to-s3:** better error handling on looped promises ([f61cf1e](https://github.com/Financial-Times/dotcom-tool-kit/commit/f61cf1e13115cb56b2e8ab02384f84b2ce57a616))
* **upload-assets-to-s3:** clarify functionality for multi bucket upload ([4e88586](https://github.com/Financial-Times/dotcom-tool-kit/commit/4e885863d26b72a4b3643624f046b2f38256670e))
* **upload-assets-to-s3:** throw error when no files found ([9ff1463](https://github.com/Financial-Times/dotcom-tool-kit/commit/9ff1463c4eeef90ae85246557ce395449bd3dee7))
* use awk-sdk v3 to resolve promise issues ([9b49b8c](https://github.com/Financial-Times/dotcom-tool-kit/commit/9b49b8ca071c2683757dab9a53d277e85a643e37))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.2.0 to ^2.2.1
    * @dotcom-tool-kit/types bumped from ^2.8.0 to ^2.9.0

### [2.0.12](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v2.0.11...upload-assets-to-s3-v2.0.12) (2022-12-14)


### Bug Fixes

* **upload-assets-to-s3:** only upload files ([e4d17d9](https://github.com/Financial-Times/dotcom-tool-kit/commit/e4d17d99b4d2c0245064cd2352018f231395df00))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^2.1.2 to ^2.2.0
    * @dotcom-tool-kit/types bumped from ^2.7.0 to ^2.7.1

### [2.0.11](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v2.0.10...upload-assets-to-s3-v2.0.11) (2022-12-08)


### Bug Fixes

* **upload-assets-to-s3:** handle AWS keys correctly ([a52db39](https://github.com/Financial-Times/dotcom-tool-kit/commit/a52db39253108cd53494a3cffea043e8e89bdbf7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/types bumped from ^2.6.2 to ^2.7.0

### [2.0.10](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v2.0.9...upload-assets-to-s3-v2.0.10) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1
    * @dotcom-tool-kit/logger bumped from ^2.1.1 to ^2.1.2
    * @dotcom-tool-kit/types bumped from ^2.6.1 to ^2.6.2

### [2.0.7](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v2.0.6...upload-assets-to-s3-v2.0.7) (2022-08-23)


### Bug Fixes

* **upload-assets-to-s3:** strip whole base directory from upload key ([84c6201](https://github.com/Financial-Times/dotcom-tool-kit/commit/84c6201e99bcbf2a0490150546e2243ea5ac1b82))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/upload-assets-to-s3-v1.9.0...upload-assets-to-s3-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/logger bumped from ^1.9.0 to ^2.0.0
    * @dotcom-tool-kit/types bumped from ^1.9.0 to ^2.0.0
