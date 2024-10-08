# @dotcom-tool-kit/n-test

A plugin to run smoke tests as part of your CircleCI workflow using the [n-test](https://github.com/Financial-Times/n-test) package.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/n-test
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/n-test'
```

<!-- begin autogenerated docs -->
## Tasks

### `NTest`

Run [n-test](https://github.com/financial-times/n-test) smoke tests against your application.
#### Task options

| Property      | Description                                                                                                                                                                                             | Type                     |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------- |
| `browsers`    | Selenium browsers to run the test against                                                                                                                                                               | `Array<string>`          |
| `host`        | Set the hostname to use for all tests. If running in an environment such as a review or staging app build that has Tool Kit state with a URL for an app to run against, that will override this option. | `string`                 |
| `config`      | Path to config file used to test                                                                                                                                                                        | `string`                 |
| `interactive` | Interactively choose which tests to run                                                                                                                                                                 | `boolean`                |
| `header`      | Request headers to be sent with every request                                                                                                                                                           | `Record<string, string>` |

_All properties are optional._
<!-- end autogenerated docs -->
