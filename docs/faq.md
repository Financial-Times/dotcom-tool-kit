
# Tool Kit FAQs

Below are responses to some general questions about Tool Kit that have been asked during migrations. If your question is not answered here please ask in the [#tool-kit](https://app.slack.com/client/T025C95MN/C02TRE2V2Q1/thread/C042NBBTM-1671107986.307219) slack channel and consider adding it, and the answer, to this document.

## How do I add package specific configuration (for e.g. ESLint) to the Tool Kit plugin (e.g. @dotcom-tool-kit/eslint))?

As much as possible Tool Kit doesn't handle configuration for third party packages. The purpose of Tool Kit’s plugins for packages is to get them working in the FT development workflow with the minimum possible configuration. Tool Kit plugins will leave package configuration to a specific configuration file for that package (e.g. `.eslintrc` for the ESLint package).

## How can I use custom commands for my tooling that are not accommodated for by Tool Kit's config?

You don't need to use Tool Kit for everything. Tool Kit handles common tooling use cases that are required for most apps to work in the Customer Products ecosystem, but it's fine for your app to include additional tooling features that don't use Tool Kit at all.

See [How do I run watch mode for tests with Tool Kit?](#how-do-i-run-watch-mode-for-tests-with-tool-kit) for a specific example of calling a third party package that Tool Kit configures without using Tool Kit at all.

## How do I run watch mode for tests with Tool Kit?

Now that we manage tasks with npm scripts, you can define a script to run your tests in watch mode:

```json
{ 
    "scripts": 
        {
            "watch-tests": "jest --watch" 
        } 
}
```

Then run `npm run watch-tests` to execute your script.

You can also use the package directly with npx to run your test runner with any options you wish:

```sh
npx jest path/to/tests --watch
```

Note, this is an example of a script that doesn't use Tool Kit at all, and that's fine.

## Is there a central list of all hooks and tasks available in Tool Kit?

Funny you should ask! We have just the thing:

| Hook                | Hook exported by plugin | Possible tasks       |
|---------------------|-------------------------|----------------------|
| `run:local`         | npm                     | `Node`               |
|                     |                         | `Nodemon`            |
|                     |                         | `NextRouter`         |
|                     |                         | `WebpackDevelopment` |
|                     |                         | `WebpackWatch`       |
|                     |                         | `TypeScriptWatch`    |
| `test:local`        | npm                     | `Mocha`              |
|                     |                         | `JestLocal`          |
|                     |                         | `Eslint`             |
|                     |                         | `CypressLocal`       |
|                     |                         | `TypeScriptTest`     |
| `build:local`       | npm                     | `BabelDevelopment`   |
|                     |                         | `WebpackDevelopment` |
|                     |                         | `TypeScriptBuild`    |
| `build:ci`          | circleci                | `BabelProduction`    |
|                     |                         | `WebpackProduction`  |
| `test:ci`           | circleci                | `Eslint`             |
|                     |                         | `Mocha`              |
|                     |                         | `JestCi`             |
|                     |                         | `CypressCi`          |
| `deploy:review`     | circleci-deploy         | `HerokuReview`       |
| `deploy:staging`    | circleci-deploy         | `HerokuStaging`      |
| `test:review`       | circleci-deploy         | `NTest`              |
|                     |                         | `Pa11y`              |
| `test:staging`      | circleci-deploy         | `NTest`              |
| `teardown:staging`  | circleci-deploy         | `HerokuTeardown`     |
| `deploy:production` | circleci-deploy         | `HerokuProduction`   |
| `publish:tag`       | circleci-npm            | `NpmPublish`         |
| `cleanup:remote`    | heroku                  | `NpmPrune`           |
| `release:remote`    | heroku                  | `UploadAssetsToS3`   |
| `build:remote`      | heroku                  | `BabelProduction`    |
|                     |                         | `WebpackProduction`  |
| `git:precommit`     | husky-npm               | `LintStaged`         |
| `git:commitmsg`     | husky-npm               |                      |
| `test:staged`       | lint-staged-npm         | `Eslint`             |
| `format:staged`     | lint-staged-npm         | `Prettier`           |
| `format:local`      | prettier                | `Prettier`           |

[table updated 4th January 2023]
