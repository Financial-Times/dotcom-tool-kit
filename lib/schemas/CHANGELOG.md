# Changelog

## 1.0.0 (2024-09-10)


### ⚠ BREAKING CHANGES

* remove backwards compatibility-preserving hacks
* **heroku:** remove systemCode option
* **vault:** remove references to Vault
* **pa11y:** remove deprecated plugin
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

* add (empty) schema exports for task schemas ([c17365e](https://github.com/Financial-Times/dotcom-tool-kit/commit/c17365e082b6d3ffbd3404ffdcf5ec1db9193207))
* add configPath option for eslint task ([1c9ebd1](https://github.com/Financial-Times/dotcom-tool-kit/commit/1c9ebd14d051ee624051707076a4eb9d84eef190))
* add watch, noEmit and build options to typescript task ([8ac8551](https://github.com/Financial-Times/dotcom-tool-kit/commit/8ac855173a7b814d7736bde62171695b799b51e6))
* allow tasks to receive a task options object and parse task schema when initialising ([1dce6bd](https://github.com/Financial-Times/dotcom-tool-kit/commit/1dce6bd5e8436bf521e94eb812aa847ca7dd1e4d))
* change jest "mode" option to a boolean "ci" option ([ca6f2d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/ca6f2d4f525fd8528ab0b758ba9c1adc09bbd59a))
* **circleci:** allow projects to rewrite whole CircleCI config ([58a96c0](https://github.com/Financial-Times/dotcom-tool-kit/commit/58a96c047497fa3b82914a73db1ad9c17de1ab7a))
* **circleci:** define CircleCI configs in .toolkitrc.yml ([16f8538](https://github.com/Financial-Times/dotcom-tool-kit/commit/16f853804e728dfc84398d2311f6059076b1aeea))
* consolidate typescript tasks and move options to task options ([b8a6c34](https://github.com/Financial-Times/dotcom-tool-kit/commit/b8a6c34cf5a73480167155e7b66316698588a6b0))
* explicitly handle legacy plugin options ([8574516](https://github.com/Financial-Times/dotcom-tool-kit/commit/8574516114a02731c77b877c7f6fb3d550434971))
* **heroku:** remove systemCode option ([be00602](https://github.com/Financial-Times/dotcom-tool-kit/commit/be00602133549c551f8a79bcbb57f9a723ae9e7c))
* **lint-staged-npm:** add PackageJson hook options ([a594afd](https://github.com/Financial-Times/dotcom-tool-kit/commit/a594afd5dbc8fab5682874595db4cc78df12ab3c))
* make ports optional in node and nodemon tasks ([aa01fb6](https://github.com/Financial-Times/dotcom-tool-kit/commit/aa01fb6d8000858efd02164f84243f2e2e2d04fb))
* move babel options to task options and allow configuring env ([d5b25a2](https://github.com/Financial-Times/dotcom-tool-kit/commit/d5b25a25e705e3311428eda1694a9a3b2541c630))
* move cypress localUrl plugin option to a url task option and change precedence ([89a5514](https://github.com/Financial-Times/dotcom-tool-kit/commit/89a551494dafed20e87d640b929dc342f445c9ec))
* move eslint plugin options to task options ([22a17ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/22a17adab5cce411b105bcdae802e78bb5c17e37))
* move jest options to task options and allow configuring env ([686f84c](https://github.com/Financial-Times/dotcom-tool-kit/commit/686f84cd30b9e8f022fa7d740cfee4c226e37da8))
* move mocha options to task options ([073d737](https://github.com/Financial-Times/dotcom-tool-kit/commit/073d737795f3828ff96b6623cde7d4908c7e48f3))
* move n-test options to task options ([72dee47](https://github.com/Financial-Times/dotcom-tool-kit/commit/72dee475a9442f26e23192f26f064d8febb843a4))
* move node options to task options ([8a8729c](https://github.com/Financial-Times/dotcom-tool-kit/commit/8a8729c9e38ac4777774058b3153f0ce4a9b448a))
* move nodemon options to task options ([de5568c](https://github.com/Financial-Times/dotcom-tool-kit/commit/de5568cbf7d6bedd37f43e46e3d4cedc15ca66d6))
* move pa11y options to task options ([bfd82f1](https://github.com/Financial-Times/dotcom-tool-kit/commit/bfd82f1b188ab9998db254c69134324dd2bbec18))
* move prettier options to task options ([71c24af](https://github.com/Financial-Times/dotcom-tool-kit/commit/71c24af0b1517008f530ce0ece85ccb9018e5100))
* move serverless run ports and useDoppler options to task options ([e5791ad](https://github.com/Financial-Times/dotcom-tool-kit/commit/e5791ada3518213ad6a8df9f59dbcf2c3c65f68d))
* move upload-assets-to-s3 options to task options ([664f519](https://github.com/Financial-Times/dotcom-tool-kit/commit/664f5196c57db79b18ecbfdb6e3cf50ea151af84))
* move webpack options to task options and allow configuring env ([658c9bb](https://github.com/Financial-Times/dotcom-tool-kit/commit/658c9bb2b78843318da943e00e1a8fe2ef7bb4a9))
* **pa11y:** remove deprecated plugin ([dd755f8](https://github.com/Financial-Times/dotcom-tool-kit/commit/dd755f878bb71239d91a04a1095d75d0c78c32f7))
* remove backwards compatibility-preserving hacks ([dc008ff](https://github.com/Financial-Times/dotcom-tool-kit/commit/dc008ff156054a5fa61b4e7b4b8bdd638d6ab57f))
* remove prettier configOptions option ([6b143d4](https://github.com/Financial-Times/dotcom-tool-kit/commit/6b143d43de921ae2ba66008ddeab83e3ea52d8ce))
* remove serverless buildNumVariable in favour of populating it via CI state ([5c96a07](https://github.com/Financial-Times/dotcom-tool-kit/commit/5c96a07f117de53cbdb2933053f36e7740d6b14d))
* remove typescript extraArgs option ([00b9a8b](https://github.com/Financial-Times/dotcom-tool-kit/commit/00b9a8b8b9b857803f825d0ec0b9cdbf553f1508))
* rename node useVault option to useDoppler ([f39d0fe](https://github.com/Financial-Times/dotcom-tool-kit/commit/f39d0fea8c51259806e70e6a9f1327abcb56a625))
* rename nodemon useVault option to useDoppler ([b80de5e](https://github.com/Financial-Times/dotcom-tool-kit/commit/b80de5e4adf2dd4dca312001c31202075bc7ac28))
* rename serverless useVault option to useDoppler ([7e0dfb3](https://github.com/Financial-Times/dotcom-tool-kit/commit/7e0dfb38299987890e322762126c1f078b2e1fd4))
* split heroku options into plugin-wide and heroku production task-specific ([bf6fcf3](https://github.com/Financial-Times/dotcom-tool-kit/commit/bf6fcf39e26f4fca3a63cc677b63a18674aea7b9))
* split remaining bits of types into config and plugins packages ([6cde9b9](https://github.com/Financial-Times/dotcom-tool-kit/commit/6cde9b90d4cd02383ae1b18ca38e0843e6c3d3ab))
* split schemas out into separate package ([5d538cd](https://github.com/Financial-Times/dotcom-tool-kit/commit/5d538cd692eec6b799587f499c444b3e4f6e78b8))
* **upload-assets-to-s3:** remove legacy environment variable handling ([9217fd8](https://github.com/Financial-Times/dotcom-tool-kit/commit/9217fd8589ec902968694ed9c851521f67f587ba))
* **vault:** remove references to Vault ([3af9cf9](https://github.com/Financial-Times/dotcom-tool-kit/commit/3af9cf917989a8505e5a96cf9a4afccdd25815d2))


### Bug Fixes

* **circleci:** don't run review jobs on tagged releases ([f373212](https://github.com/Financial-Times/dotcom-tool-kit/commit/f373212518183be7841205a6aed7c0c5a96ef747))
* make zod peerdeps of types and schema, and explicit deps of cli and create ([bc252ca](https://github.com/Financial-Times/dotcom-tool-kit/commit/bc252ca5245a69a6b7a30ea79fe1219699d102c6))


### Code Refactoring

* rename SchemaOptions to PluginOptions ([0ce24db](https://github.com/Financial-Times/dotcom-tool-kit/commit/0ce24db808d077a0e4647d3bef9eaf55223a1cdf))