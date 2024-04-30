# Changelog

## 1.0.0 (2024-04-30)


### ⚠ BREAKING CHANGES

* **upload-assets-to-s3:** remove legacy environment variable handling
* change jest "mode" option to a boolean "ci" option
* move serverless run ports and useDoppler options to task options
* remove serverless buildNumVariable in favour of populating it via CI state
* rename serverless useVault option to useDoppler
* split heroku options into plugin-wide and heroku production task-specific
* move cypress localUrl plugin option to a url task option and change precedence
* move n-test options to task options
* move webpack options to task options and allow configuring env
* move upload-assets-to-s3 options to task options
* remove typescript extraArgs option
* consolidate typescript tasks and move options to task options
* remove prettier configOptions option
* move prettier options to task options
* move pa11y options to task options
* rename nodemon useVault option to useDoppler
* move nodemon options to task options
* rename node useVault option to useDoppler
* move node options to task options
* move mocha options to task options
* move jest options to task options and allow configuring env
* move eslint plugin options to task options
* move babel options to task options and allow configuring env
* **circleci:** define CircleCI configs in .toolkitrc.yml
* rename SchemaOptions to PluginOptions

### Features

* add (empty) schema exports for task schemas ([a7e6891](https://github.com/Financial-Times/dotcom-tool-kit/commit/a7e68911148679be4138cb7ebf8ecc55b45a4e28))
* add configPath option for eslint task ([9d532fa](https://github.com/Financial-Times/dotcom-tool-kit/commit/9d532fa2f9438cf2b518a62fb3b306c071656429))
* add watch, noEmit and build options to typescript task ([8324d5f](https://github.com/Financial-Times/dotcom-tool-kit/commit/8324d5fec839d12b034f34ead35d62e441b60a8c))
* allow tasks to receive a task options object and parse task schema when initialising ([995eb38](https://github.com/Financial-Times/dotcom-tool-kit/commit/995eb386ce8f475c33f7edd7645b73cb57de25f8))
* change jest "mode" option to a boolean "ci" option ([f067721](https://github.com/Financial-Times/dotcom-tool-kit/commit/f0677219c15bac5da514fae6f1226317c5525e5d))
* **circleci:** allow projects to rewrite whole CircleCI config ([37507f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/37507f1cad182fcc6956067017cb5ab056ea78b9))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([641e242](https://github.com/Financial-Times/dotcom-tool-kit/commit/641e242f7edf95bbd7c31bcba89eb532cf9427d1))
* consolidate typescript tasks and move options to task options ([55f8c4c](https://github.com/Financial-Times/dotcom-tool-kit/commit/55f8c4caf23cb09d874eb0968172058b7d899228))
* explicitly handle legacy plugin options ([afc8d54](https://github.com/Financial-Times/dotcom-tool-kit/commit/afc8d54561bba42b133716c62e4b120dde27d8df))
* **lint-staged-npm:** add PackageJson hook options ([e6e8f39](https://github.com/Financial-Times/dotcom-tool-kit/commit/e6e8f397b8661fd62a5b2fba4cdec3fa9be0f1a5))
* make ports optional in node and nodemon tasks ([c5b63af](https://github.com/Financial-Times/dotcom-tool-kit/commit/c5b63af05f6a7420498691966286a7059a046ff4))
* move babel options to task options and allow configuring env ([f707366](https://github.com/Financial-Times/dotcom-tool-kit/commit/f707366f27e6a38175afa7dbf2a549c0ba8f67b7))
* move cypress localUrl plugin option to a url task option and change precedence ([e9d11ef](https://github.com/Financial-Times/dotcom-tool-kit/commit/e9d11ef13ac83e567d049aa66f2878eb77d3de1c))
* move eslint plugin options to task options ([d9a0d62](https://github.com/Financial-Times/dotcom-tool-kit/commit/d9a0d62633875ca198308dae3e0e2fa35cd7c621))
* move jest options to task options and allow configuring env ([29ed0f2](https://github.com/Financial-Times/dotcom-tool-kit/commit/29ed0f2843b97732379cdf2c342de8e6ed748409))
* move mocha options to task options ([08b092b](https://github.com/Financial-Times/dotcom-tool-kit/commit/08b092bc1f3af5ee56413f17a7affdab3eed057e))
* move n-test options to task options ([c74af9b](https://github.com/Financial-Times/dotcom-tool-kit/commit/c74af9b4394493f52287c38d0b0402c9b3f61cc6))
* move node options to task options ([38b3146](https://github.com/Financial-Times/dotcom-tool-kit/commit/38b31467c94a40f009d354ac84eef1866a1e516f))
* move nodemon options to task options ([3cc635c](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cc635c7afe8a63d8b20c634124e4d46dfa9e4ee))
* move pa11y options to task options ([d6ac04c](https://github.com/Financial-Times/dotcom-tool-kit/commit/d6ac04ce71eece7e0ee138cab75087c9f980c49a))
* move prettier options to task options ([945aa82](https://github.com/Financial-Times/dotcom-tool-kit/commit/945aa82a8aad8b622683eb8f07e5dc8180e93c5a))
* move serverless run ports and useDoppler options to task options ([61fbaae](https://github.com/Financial-Times/dotcom-tool-kit/commit/61fbaaec890b51861cedf6076691fa5dc1bc5873))
* move upload-assets-to-s3 options to task options ([d733325](https://github.com/Financial-Times/dotcom-tool-kit/commit/d73332579afedec9c3027c09ab1efd6f1e58d73c))
* move webpack options to task options and allow configuring env ([9f85554](https://github.com/Financial-Times/dotcom-tool-kit/commit/9f85554362cbbf4c2207e61165cf5d0ae1e0dc01))
* remove prettier configOptions option ([06f358e](https://github.com/Financial-Times/dotcom-tool-kit/commit/06f358e71f8d62ae58fe05527621ac001dcdff4b))
* remove serverless buildNumVariable in favour of populating it via CI state ([bf9fa13](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf9fa136d2dd21a6f2590d5b0b5082be7ffd5983))
* remove typescript extraArgs option ([426d82f](https://github.com/Financial-Times/dotcom-tool-kit/commit/426d82f6ef3b600ec416448470ab46cb90058afe))
* rename node useVault option to useDoppler ([3cfa085](https://github.com/Financial-Times/dotcom-tool-kit/commit/3cfa0857340778d7ef09f27e1d2f809a35236df9))
* rename nodemon useVault option to useDoppler ([53a051f](https://github.com/Financial-Times/dotcom-tool-kit/commit/53a051f214620b5109a9ac2d2078298256d4b648))
* rename serverless useVault option to useDoppler ([5d39489](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d3948960cb8a96f85728123f35add35b75022a2))
* split heroku options into plugin-wide and heroku production task-specific ([9653311](https://github.com/Financial-Times/dotcom-tool-kit/commit/9653311b8d9424327b6f217d626389674472d332))
* split remaining bits of types into config and plugins packages ([ee5839b](https://github.com/Financial-Times/dotcom-tool-kit/commit/ee5839b7ac6a9fc8321beb8a7503f624aabf15b7))
* split schemas out into separate package ([6aecf35](https://github.com/Financial-Times/dotcom-tool-kit/commit/6aecf3585aab155fe6f356997fd60bd5c34c38ef))
* **upload-assets-to-s3:** remove legacy environment variable handling ([1eb0d6b](https://github.com/Financial-Times/dotcom-tool-kit/commit/1eb0d6bd1a1e15e92899f9a3e7784a1928e617e4))


### Bug Fixes

* make zod peerdeps of types and schema, and explicit deps of cli and create ([9cce80a](https://github.com/Financial-Times/dotcom-tool-kit/commit/9cce80af4dcb1a066d692dafaf97767ca4a59e56))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([7de8626](https://github.com/Financial-Times/dotcom-tool-kit/commit/7de862654fe2ca474ddfd6b28bc133a4de17c803))
