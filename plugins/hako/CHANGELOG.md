# Changelog

### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.10 to ^1.2.0

## [0.2.0](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.23...hako-v0.2.0) (2025-10-28)


### ⚠ BREAKING CHANGES

* drop node 18 support by updating related configs

### Features

* drop node 18 support by updating related configs ([2968f50](https://github.com/Financial-Times/dotcom-tool-kit/commit/2968f50e47a824ec3380346d81aa920dbf45b903))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.3.1 to ^2.0.0
    * @dotcom-tool-kit/error bumped from ^4.1.1 to ^5.0.0
    * @dotcom-tool-kit/logger bumped from ^4.2.2 to ^5.0.0
    * @dotcom-tool-kit/state bumped from ^4.3.2 to ^5.0.0
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 5.0.0

## [0.1.23](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.22...hako-v0.1.23) (2025-10-09)


### Features

* **hako:** add cp-internal-review-eu environment ([4605bdf](https://github.com/Financial-Times/dotcom-tool-kit/commit/4605bdf53bc7704584404b0022a58dbb798d9718))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.3.0 to ^1.3.1
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 4.10.1

## [0.1.22](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.21...hako-v0.1.22) (2025-08-29)


### Features

* **hako:** support a canary env ([947036e](https://github.com/Financial-Times/dotcom-tool-kit/commit/947036e5a55f5c35a39d46ddc877a28d702fb65d))

## [0.1.21](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.20...hako-v0.1.21) (2025-08-12)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.3 to ^1.3.0
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 4.10.0

## [0.1.20](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.19...hako-v0.1.20) (2025-07-31)


### Features

* **hako:** bump hako to 0.2.14 ([42f5b74](https://github.com/Financial-Times/dotcom-tool-kit/commit/42f5b74154f44185380b5c912c55978072aca9ec))

## [0.1.19](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.18...hako-v0.1.19) (2025-07-23)


### Features

* **hako:** upgrade Hako from 0.2.9 to 0.2.13 ([b565fb3](https://github.com/Financial-Times/dotcom-tool-kit/commit/b565fb30537bc4c69a127faba77b2eaf17d5cddb))

## [0.1.18](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.17...hako-v0.1.18) (2025-07-08)


### Bug Fixes

* add review environment hako domain ([efc33bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/efc33bdc751f884625394607365264172c68a325))
* allow -review suffix in hako environments ([47ab3a3](https://github.com/Financial-Times/dotcom-tool-kit/commit/47ab3a33b2a068c2e51887e56da183498844551b))


### Dependencies

* The following workspace dependencies were updated
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 4.9.0

## [0.1.17](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.16...hako-v0.1.17) (2025-07-02)


### Features

* **hako:** upgrade Hako from 0.2.7 to 0.2.9 ([23890a9](https://github.com/Financial-Times/dotcom-tool-kit/commit/23890a9740e85534bbc2fc6315c13b8eccc7a4a3))

## [0.1.16](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.15...hako-v0.1.16) (2025-06-17)


### Bug Fixes

* **hako:** correct hako argument to delete ephemeral app ([a16a6cf](https://github.com/Financial-Times/dotcom-tool-kit/commit/a16a6cf249714e4c772c32474393d646f7c430d9))

## [0.1.15](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.14...hako-v0.1.15) (2025-05-30)


### Features

* **hako:** add HakoDelete task ([2b1fd2b](https://github.com/Financial-Times/dotcom-tool-kit/commit/2b1fd2beac8bcbfcc410d5700771a5c24d65f1a9))
* **hako:** allow specifying custom ephemeral IDs and manifest files ([8dee8d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/8dee8d489cb432bd5a5435c2e676d9a338c45bfc))


### Bug Fixes

* ensure tasks exit the command on failure ([267750e](https://github.com/Financial-Times/dotcom-tool-kit/commit/267750e0baa467e513e95cbf69e8d53db5c886c1))

## [0.1.14](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.13...hako-v0.1.14) (2025-05-21)


### Features

* update hako CLI to v0.2.7-beta ([1801316](https://github.com/Financial-Times/dotcom-tool-kit/commit/1801316e17441b711b479bbae9ffeb11e7ba8790))

## [0.1.13](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.12...hako-v0.1.13) (2025-05-20)


### Features

* **hako:** be more permissive with environment names ([2ee3990](https://github.com/Financial-Times/dotcom-tool-kit/commit/2ee39900038dbee4b8aec9e9597b10588f454573))


### Bug Fixes

* bump zod from 3.24.3 to 3.24.4 ([2059a64](https://github.com/Financial-Times/dotcom-tool-kit/commit/2059a64ff9ab1b246f5b4e6b5b66f465be596b9e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.2 to ^1.2.3
    * @dotcom-tool-kit/logger bumped from ^4.2.1 to ^4.2.2
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 4.8.0

## [0.1.12](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.11...hako-v0.1.12) (2025-05-06)


### Features

* update hako to v0.2.6-beta ([e05cc47](https://github.com/Financial-Times/dotcom-tool-kit/commit/e05cc479bf8127b95326641d2194b7931cf149f5))

## [0.1.11](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.10...hako-v0.1.11) (2025-05-06)


### Features

* update hako to v0.2.5-beta ([7f6a39f](https://github.com/Financial-Times/dotcom-tool-kit/commit/7f6a39fa3b20a5524d9f5ee73637353e423a9a28))


### Bug Fixes

* bump tslib from 2.4.1 to 2.8.1 ([e96041f](https://github.com/Financial-Times/dotcom-tool-kit/commit/e96041fd539954bf26652a35e3d86330e47deeb6))
* bump zod from 3.24.2 to 3.24.3 ([21ecd2c](https://github.com/Financial-Times/dotcom-tool-kit/commit/21ecd2ccaf42f11a78e0b6f06f5ef2352aa91703))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.1 to ^1.2.2
    * @dotcom-tool-kit/error bumped from ^4.1.0 to ^4.1.1
    * @dotcom-tool-kit/logger bumped from ^4.2.0 to ^4.2.1
    * @dotcom-tool-kit/state bumped from ^4.3.1 to ^4.3.2
  * peerDependencies
    * dotcom-tool-kit bumped from 4.x to 4.7.3

## [0.1.10](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.9...hako-v0.1.10) (2025-04-10)


### Features

* update hako to v0.2.4-beta ([a1b5197](https://github.com/Financial-Times/dotcom-tool-kit/commit/a1b5197251aabbb9ff5a7abf70e17a6ab01dc606))

## [0.1.9](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.8...hako-v0.1.9) (2025-04-03)


### Bug Fixes

* **hako:** bump to latest hako image ([2cafa28](https://github.com/Financial-Times/dotcom-tool-kit/commit/2cafa28caeb76bbd8043abba6b3dd7a9f79c6829))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.2.0 to ^1.2.1
    * @dotcom-tool-kit/logger bumped from ^4.1.1 to ^4.2.0

## [0.1.8](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.7...hako-v0.1.8) (2025-03-13)


### Bug Fixes

* **hako:** use correct load balancer URL based on environment ([319072f](https://github.com/Financial-Times/dotcom-tool-kit/commit/319072fe693fd342527c68b269714f83993cc254))

## [0.1.7](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.6...hako-v0.1.7) (2025-03-13)


### Bug Fixes

* make review app URLs predictable ([569515b](https://github.com/Financial-Times/dotcom-tool-kit/commit/569515ba94c00fd57d2b0dc88728c6fc5c41a5e9))

## [0.1.6](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.5...hako-v0.1.6) (2025-03-03)


### Features

* support review apps ([3e15f55](https://github.com/Financial-Times/dotcom-tool-kit/commit/3e15f55c24afec7c3c80f75b5fc0316a8232f110))

## [0.1.4](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.3...hako-v0.1.4) (2025-02-24)


### Bug Fixes

* upgrade hako to v0.1.11-alpha ([8e18561](https://github.com/Financial-Times/dotcom-tool-kit/commit/8e18561eefd2e9f248c96391d6235d220ac8df9b))

## [0.1.3](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.2...hako-v0.1.3) (2025-02-18)


### Bug Fixes

* migrate to hako v0.1.10-alpha ([cf34ec8](https://github.com/Financial-Times/dotcom-tool-kit/commit/cf34ec8ed9a8887e6fa2babbdb3b48203babf4a7))

## [0.1.2](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.1...hako-v0.1.2) (2025-02-17)


### Features

* move task schemas into plugins ([76b96e5](https://github.com/Financial-Times/dotcom-tool-kit/commit/76b96e54ea0c9880bbedcc708ffde77638c8c267))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.9 to ^1.1.10

## [0.1.1](https://github.com/Financial-Times/dotcom-tool-kit/compare/hako-v0.1.0...hako-v0.1.1) (2025-02-14)


### Bug Fixes

* use a new "docker" state for pushed images ([b0b9350](https://github.com/Financial-Times/dotcom-tool-kit/commit/b0b9350128faa5a2eef644a264da527c39fd93f5))
* use nullish coalescing operators ([85510f5](https://github.com/Financial-Times/dotcom-tool-kit/commit/85510f583f1cd6b4c80908c3f26b5bb249384249))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/state bumped from ^4.3.0 to ^4.3.1

## 0.1.0 (2025-02-11)


### Features

* add a new Hako Deploy plugin ([34980cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/34980cd8763c24bc457c5355f46cd69b756f1755))
* replace hako image text with variable, remove hakoEnv type hinting ([bf9199c](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9199cb43b3331b17086265ac8dda651e30f824))
* update hako deploy plugin with latest hako v0.1.8-alpha ([6bdfcb9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6bdfcb93517f927184f41e27a16c015ceb638a5f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @dotcom-tool-kit/base bumped from ^1.1.8 to ^1.1.9
  * devDependencies
    * @dotcom-tool-kit/schemas bumped from ^1.8.0 to ^1.9.0
