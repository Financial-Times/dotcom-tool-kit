# Changelog

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.3 to ^1.0.4

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/validated bumped from ^1.0.1 to ^1.0.2
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.4 to ^1.0.5
    * @dotcom-tool-kit/logger bumped from ^4.0.1 to ^4.1.0

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.5 to ^1.0.6

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.6 to ^1.0.7

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.8 to ^1.0.9

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.9 to ^1.0.10

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.10 to ^1.0.11

### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.11 to ^1.0.12

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/conflict bumped from ^1.0.0 to ^1.0.1
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.12 to ^1.1.0
    * @dotcom-tool-kit/plugin bumped from ^1.0.0 to ^1.1.0

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^4.1.1 to ^4.2.0

## [1.2.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.2.2...base-v1.2.3) (2025-05-20)


### Bug Fixes

* bump semver from 7.7.1 to 7.7.2 ([9f82a24](https://github.com/Financial-Times/dotcom-tool-kit/commit/9f82a24fca533d05ec0fad171ca2b72dc3d0fb96))
* bump winston from 3.14.2 to 3.17.0 ([c0bc4c7](https://github.com/Financial-Times/dotcom-tool-kit/commit/c0bc4c71af06ac26323c826f24896e735591ac1a))
* bump zod from 3.24.3 to 3.24.4 ([2059a64](https://github.com/Financial-Times/dotcom-tool-kit/commit/2059a64ff9ab1b246f5b4e6b5b66f465be596b9e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^4.2.1 to ^4.2.2

## [1.2.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.2.1...base-v1.2.2) (2025-05-06)


### Bug Fixes

* bump zod from 3.24.2 to 3.24.3 ([21ecd2c](https://github.com/Financial-Times/dotcom-tool-kit/commit/21ecd2ccaf42f11a78e0b6f06f5ef2352aa91703))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^4.2.0 to ^4.2.1
    * @dotcom-tool-kit/validated bumped from ^1.0.2 to ^1.0.3
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.1.0 to ^1.1.1

## [1.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.1.10...base-v1.2.0) (2025-03-03)


### Features

* **base:** pass cwd into init method ([b6cc028](https://github.com/Financial-Times/dotcom-tool-kit/commit/b6cc028129138869866f88860d544f5056668080))

## [1.1.5](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.1.4...base-v1.1.5) (2025-01-14)


### Bug Fixes

* **base:** move logger dependency to prod ([c1c8a57](https://github.com/Financial-Times/dotcom-tool-kit/commit/c1c8a57e2e459e13b37efd519a80ff60835bde72))
* **cli:** try to always log ToolKitError details if present ([0d4f2b4](https://github.com/Financial-Times/dotcom-tool-kit/commit/0d4f2b4cf7de12a290b19c13ad7be27b41197896))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/logger bumped from ^4.1.0 to ^4.1.1
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.7 to ^1.0.8

## [1.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/base-v1.0.0...base-v1.1.0) (2024-12-09)


### Features

* pass config into taskruncontext ([435ffbc](https://github.com/Financial-Times/dotcom-tool-kit/commit/435ffbc74a81bdd159d4ea01943c6614ed1d3471))
* pass current command into task run context ([e4cf21c](https://github.com/Financial-Times/dotcom-tool-kit/commit/e4cf21c8c4e502b02918736b8b127097dba27572))
* pass task cwd through via TaskRunContext ([b12fe30](https://github.com/Financial-Times/dotcom-tool-kit/commit/b12fe30916e99e157e131a99fca6c59960b89f3a))


### Bug Fixes

* freeze the config before passing it into tasks ([a0283b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/a0283b9b5a48314a26ce04ce4c176ab5f4aacc07))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/validated bumped from ^1.0.0 to ^1.0.1
  * devDependencies
    * @dotcom-tool-kit/config bumped from ^1.0.2 to ^1.0.3
    * @dotcom-tool-kit/logger bumped from ^4.0.0 to ^4.0.1

## 1.0.0 (2024-09-10)


### ⚠ BREAKING CHANGES

* pass task files in as part of a run context object
* rename Task#options to pluginOptions
* move base classes into their own package

### Features

* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* move base classes into their own package ([be1681b](https://github.com/Financial-Times/dotcom-tool-kit/commit/be1681b033609a9e332ab072681b6de8d05befb2))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))


### Code Refactoring

* pass task files in as part of a run context object ([5aa7327](https://github.com/Financial-Times/dotcom-tool-kit/commit/5aa7327018c0a87c8c9feef36ef9e3735a4f5e6d))
* rename Task#options to pluginOptions ([e73dcae](https://github.com/Financial-Times/dotcom-tool-kit/commit/e73dcae5ff48693545aa20e5c572269c3adf486b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @dotcom-tool-kit/logger bumped from ^3.3.0 to ^4.0.0
