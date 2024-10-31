# Changelog

## [5.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v5.0.2...orb-v5.1.0) (2024-10-31)


### Features

* install docker on review and production ([4d10aae](https://github.com/Financial-Times/dotcom-tool-kit/commit/4d10aaec91b62cd4c1834a5b9797aa2cf77e0ae7))
* install docker on staging deploy ([4f50b34](https://github.com/Financial-Times/dotcom-tool-kit/commit/4f50b34dd004f6cb19d1e6fbb7b5c56d9d8f6333))

## [5.0.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v5.0.1...orb-v5.0.2) (2024-05-22)


### Bug Fixes

* upgrade serverless-framework orb ([bf66cf7](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf66cf7c2cb808b4a2ce4c4e35e8a5350eb227bb))

## [5.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v5.0.0...orb-v5.0.1) (2024-02-01)


### Bug Fixes

* add serverles-assume-role steps to e2e-test-review job ([d25947c](https://github.com/Financial-Times/dotcom-tool-kit/commit/d25947c55e201cebb359c4e1950edeca486c4604))

## [5.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.3.1...orb-v5.0.0) (2024-01-25)


### ⚠ BREAKING CHANGES

* **orb:** add teardown:review step to e2e-test-review job

### Bug Fixes

* **orb:** add teardown:review step to e2e-test-review job ([e09d874](https://github.com/Financial-Times/dotcom-tool-kit/commit/e09d87476288f3bd5c83fd5fd141bf6a3c059e36))

## [4.3.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.3.0...orb-v4.3.1) (2024-01-24)


### Bug Fixes

* temporarily remove teardown:review step from e2e-test-review job. This was a breaking change and it should have required a major release ([4202398](https://github.com/Financial-Times/dotcom-tool-kit/commit/4202398632f7b36832234a5a0305a1b6cbb4e322))

## [4.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.2.3...orb-v4.3.0) (2024-01-23)


### Features

* add teardown:review hook ([e00fcb4](https://github.com/Financial-Times/dotcom-tool-kit/commit/e00fcb4739f684ab62329dfe246b4981a9fdebc9))

## [4.2.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.2.2...orb-v4.2.3) (2023-10-24)


### Bug Fixes

* **orb:** install npm version if param set ([723043a](https://github.com/Financial-Times/dotcom-tool-kit/commit/723043aad3b2fc121e6f32d4580038a80bb597c0))
* **orb:** revert deletion of npm-version parameter ([f6ec1cf](https://github.com/Financial-Times/dotcom-tool-kit/commit/f6ec1cf0dfc4b7fb15946e79511bc1975256f9c7))
* **orb:** stop force using npm 8 on circleci ([5b8ad86](https://github.com/Financial-Times/dotcom-tool-kit/commit/5b8ad86720ee488d42290eb6e8e21388e7964f4e))

## [4.2.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.2.1...orb-v4.2.2) (2023-10-23)


### Bug Fixes

* **orb:** install doppler CLI for jobs that call it ([d053e1d](https://github.com/Financial-Times/dotcom-tool-kit/commit/d053e1d1096a199147f3f8d51bbc2365f6e5b922))

## [4.2.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.2.0...orb-v4.2.1) (2023-09-19)


### Bug Fixes

* bump the Change API orb version ([ac5c64c](https://github.com/Financial-Times/dotcom-tool-kit/commit/ac5c64ce6387269be5131af9c16d5b88af68fc5a))

## [4.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.1.1...orb-v4.2.0) (2023-09-04)


### Features

* store e2e test results ([c22f83b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c22f83b6e12ecb96e892bd2d77e1ac3031e8d0f4))

## [4.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.1.0...orb-v4.1.1) (2023-05-02)


### Bug Fixes

* **orb:** revert default docker executor version back to Node 16 ([05d02ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/05d02ad7097a087d0e2bf5d39b54c5637a653f07))

## [4.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v4.0.0...orb-v4.1.0) (2023-04-28)


### Features

* **orb:** bump default docker executor version to Node 18 ([6dad141](https://github.com/Financial-Times/dotcom-tool-kit/commit/6dad141392cad7951a769ac3837831ceb4e514a3))


### Bug Fixes

* **orb:** use latest change-api-orb to fix change-api curl request ([ab21f48](https://github.com/Financial-Times/dotcom-tool-kit/commit/ab21f48ba4cfd4cce5a99831fe3eabc81939e26f))

## [4.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v3.3.1...orb-v4.0.0) (2023-04-18)


### ⚠ BREAKING CHANGES

* drop support for Node 14 across all packages

### Bug Fixes

* **orb:** revert use env_var_name type for defining system-code for change-api orb ([269c06e](https://github.com/Financial-Times/dotcom-tool-kit/commit/269c06ef4a099f5f84a4c30bb41894443d0e5466))
* **orb:** use latest change-api-orb to fix change-api curl request ([b003897](https://github.com/Financial-Times/dotcom-tool-kit/commit/b00389700da137b9331bcc48bf65735f1b2b554a))


### Miscellaneous Chores

* drop support for Node 14 across all packages ([aaee178](https://github.com/Financial-Times/dotcom-tool-kit/commit/aaee178b535a51f9c75a882d78ffd8e8aa3eac60))

## [3.3.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v3.3.0...orb-v3.3.1) (2023-04-17)


### Bug Fixes

* **orb:** use env_var_name type for defining system-code ([39640f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/39640f176954ebdbcb8386e71caa645c5c8fe535))

## [3.3.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v3.2.0...orb-v3.3.0) (2023-04-05)


### Features

* allow OIDC authentication for deploy:production hook ([7afa8d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/7afa8d37f8886dc6e7eccfc0e3e654789f5f4f85))
* **orb:** clarify names of jobs in orb ([7ce7016](https://github.com/Financial-Times/dotcom-tool-kit/commit/7ce7016e975ee18b10786588c5d799667373b201))


### Bug Fixes

* **orb:** remove execute permissions from orb's YAML config files ([86938fa](https://github.com/Financial-Times/dotcom-tool-kit/commit/86938fa637d6690f490e0ae1aa70b278b1e4c5cb))

## [3.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v3.1.0...orb-v3.2.0) (2023-03-07)


### Features

* **orb:** add support for assuming AWS role in provisioning job ([65dbabd](https://github.com/Financial-Times/dotcom-tool-kit/commit/65dbabd58adf55fa078482b79ea6fd98434238b0))

## [3.1.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v3.0.0...orb-v3.1.0) (2023-01-24)


### Features

* **orb:** update to change-api orb 1.0 ([257b267](https://github.com/Financial-Times/dotcom-tool-kit/commit/257b26731ff7c1a987c1c9b27ee82470c30fdf93))

## [3.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v2.0.1...orb-v3.0.0) (2022-12-08)


### ⚠ BREAKING CHANGES

* **orb:** allow the executor to be set for a job

### Features

* **orb:** allow the executor to be set for a job ([3176451](https://github.com/Financial-Times/dotcom-tool-kit/commit/3176451e5dfe93737ef21503d02a2da77d6d87a2))

### [2.0.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v2.0.0...orb-v2.0.1) (2022-08-15)


### Bug Fixes

* pass environment to Change API ([d39292e](https://github.com/Financial-Times/dotcom-tool-kit/commit/d39292e4acd65c17fa476b465d6d770e0a156c39))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/orb-v2.0.0...orb-v2.0.0) (2022-05-06)


### ⚠ BREAKING CHANGES

* bump Node versions in orb

### Miscellaneous Chores

* bump Node versions in orb ([fde5c13](https://github.com/Financial-Times/dotcom-tool-kit/commit/fde5c132ed9a83c4b7d9a336018fd87fb88c1880))
* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))

## [2.0.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/v1.9.0...v2.0.0) (2022-04-19)


### ⚠ BREAKING CHANGES

* bump Node versions in orb

### Miscellaneous Chores

* bump Node versions in orb ([fde5c13](https://github.com/Financial-Times/dotcom-tool-kit/commit/fde5c132ed9a83c4b7d9a336018fd87fb88c1880))
* release 2.0 version for all packages ([42dc5d3](https://github.com/Financial-Times/dotcom-tool-kit/commit/42dc5d39bf330b9bca4121d062470904f9c6918d))
