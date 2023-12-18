# Changelog

## [3.3.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.3.0...logger-v3.3.1) (2023-12-18)


### Bug Fixes

* **logger:** log if a child process was terminated by a signal ([5a4a9af](https://github.com/Financial-Times/dotcom-tool-kit/commit/5a4a9af7cd57b7f9728c8b59b75c57e0967a8aeb))

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.2.0...logger-v3.3.0) (2023-10-16)


### Features

* **cli:** print when a task is run for visibility ([63c3829](https://github.com/Financial-Times/dotcom-tool-kit/commit/63c38294eab5ca900bfa8ec5932654b7f3efa68b))


### Bug Fixes

* **logger:** don't print ANSI escape code to reset terminal ([dc9989b](https://github.com/Financial-Times/dotcom-tool-kit/commit/dc9989bc3af898e479e0ada1ff129a3ecbf38524))
* **logger:** trim logs for forked subprocesses too ([d1374d1](https://github.com/Financial-Times/dotcom-tool-kit/commit/d1374d143d75d9abc018fb7c3a62a97be10c432d))

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.1.1...logger-v3.2.0) (2023-09-19)


### Features

* **logger:** add exit code to Tool Kit error ([85fcbd0](https://github.com/Financial-Times/dotcom-tool-kit/commit/85fcbd03499f7ee876326e35d718ae79c06809c0))


### Bug Fixes

* **logger:** handle spawned processes that failed ([03d8d0d](https://github.com/Financial-Times/dotcom-tool-kit/commit/03d8d0d8366c0da7627ee524be0acb24a09c7d86))

## [3.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.1.0...logger-v3.1.1) (2023-06-14)


### Bug Fixes

* **logger:** don't separate every flush to hooked fork by newline ([368e528](https://github.com/Financial-Times/dotcom-tool-kit/commit/368e52804043f2caa67f1cf9193d09194c5d3c15))
* **logger:** don't store labels of filtered logs ([8ecc04c](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ecc04cd5cdb01fbb67e2b0cf6a29d213cd83212))

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v3.0.0...logger-v3.1.0) (2023-04-28)


### Features

* specify Node 18 support in all packages' engines fields ([3b55c79](https://github.com/Financial-Times/dotcom-tool-kit/commit/3b55c79f3f55b448f1a92fcf842dab6a8906ea70))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^3.0.0 to ^3.1.0

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.2.1...logger-v3.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.1 to ^3.0.0

## [2.2.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.2.0...logger-v2.2.1) (2023-03-07)


### Bug Fixes

* **logger:** suggest actions in event of hookFork failure ([20ead67](https://github.com/Financial-Times/dotcom-tool-kit/commit/20ead677bdd3e6d9dc5cc4ea7fda47aae6d7476a))

## [2.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.1.2...logger-v2.2.0) (2022-12-14)


### Features

* **logger:** reduce noise created by metadata prefixes ([0321e6b](https://github.com/Financial-Times/dotcom-tool-kit/commit/0321e6b151d6c4ea9b496c2e5211860163da8a2e))

### [2.1.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.1.1...logger-v2.1.2) (2022-11-09)


### Bug Fixes

* add tslib to individual plugins ([142363e](https://github.com/Financial-Times/dotcom-tool-kit/commit/142363edb2a82ebf4dc3c8e1b392888ebfd7dc89))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/error bumped from ^2.0.0 to ^2.0.1

### [2.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.1.0...logger-v2.1.1) (2022-08-05)


### Bug Fixes

* prevent infinite recursion when logging "[" ([7eb71c2](https://github.com/Financial-Times/dotcom-tool-kit/commit/7eb71c2a0efe56ce9566fc8efa6b916ed0414a75))

## [2.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v2.0.0...logger-v2.1.0) (2022-07-21)


### Features

* add style for logging code snippets ([de80bfd](https://github.com/Financial-Times/dotcom-tool-kit/commit/de80bfdb1458f44db2fc1c47174600b34deb98d3))
* add style for logging code snippets ([13823bc](https://github.com/Financial-Times/dotcom-tool-kit/commit/13823bc767ef7235e122750f9c59b1501578e617))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/logger-v1.9.0...logger-v2.0.0) (2022-04-19)


### Miscellaneous Chores

* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))
