# @dotcom-tool-kit/cypress

Tool Kit plugin to run [Cypress](https://www.cypress.io)

## Installation & usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/cypress
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/cypress'
```

### Testing with Cypress locally

For local development, by default the `CypressLocal` task runs on the `e2e:local` hook. This hook is also defined within the `cypress` plugin and will install itself into your `package.json` config as the script `e2e-local`. Therefore, to run Cypress on a local instance of your project you just need to call `npm run e2e-local`. Note that, by default, this task does __not__ run your application for you, so if that's controlled by Tool Kit it's recommended you add its task to the `e2e:local` hook too. For example, your config could look like:

```yml
plugins:
  - '@dotcom-tool-kit/cypress'
  - '@dotcom-tool-kit/node'

hooks:
  'e2e:local':
    - Node
    - CypressLocal
```

### Testing with Cypress on CI

The `CypressCI` task runs on the `test:review` and `test:staging` hooks by default. These will run your Cypress end-to-end tests against the currently deployed review or staging app respectively.

### Running on another hook
You can also configure Cypress to run on any other hook; for example, if you want to run it with `npm run test` via the `npm` plugin, you can manually configure Cypress to run on `npm`'s `test:local` hook:

```yml
plugins:
  - '@dotcom-tool-kit/cypress'
  - '@dotcom-tool-kit/node'
  - '@dotcom-tool-kit/npm'

hooks:
  'test:local':
    - Node
    - CypressLocal
```

## Options

| Key | Description | Default value |
|-|-|-|
| `localUrl` | URL for Cypress to connect to for local tests | _required (if using `CypressLocal`)_ |

## Hooks

| Event | Description | Installed to...| Default Tasks
|-|-|-|-|
| `e2e:local` | Run end-to-end tests locally | `e2e-local` job in `package.json` | `CypressLocal` |

## Tasks

| Task | Description | Default hooks |
|-|-|-|
| `CypressLocal` | Run Cypress against local app | `e2e:local` |
| `CypressCI` | Run Cypress against Heroku apps | `test:review`, `test:staging` |
