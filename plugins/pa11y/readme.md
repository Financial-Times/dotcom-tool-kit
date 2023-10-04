# @dotcom-tool-kit/pa11y [DEPRECATED]

A plugin to run [Pa11y](https://github.com/pa11y/pa11y) accessibility tests. This plugin uses [Pa11y CI](https://github.com/pa11y/pa11y-ci) to run the tests.

## Deprecation warning (04/10/2023)

Customer Products no longer recommends using Pa11y for Accessibility testing. This package will be deleted by the end of the year ([CPP-1719](https://financialtimes.atlassian.net/browse/CPP-1719)). We suggest flowing the [Accessibility Guidance in Tech Hub](https://tech.in.ft.com/tech-topics/front-end-development/accessibility) to setup Accessibility testing.

Read more about this decision here: https://financialtimes.atlassian.net/wiki/spaces/CPP/blog/2023/10/04/8161493012/Deprecation+of+Pa11y+in+Customer+Products

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/pa11y
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/pa11y'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `configFile` | Path to the config file | `.pa11yci.js` |

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `Pa11y` | runs `pa11y-ci` to execute Pa11y tests | `test:local` |

## To note

This plugin will define `process.env.TEST_URL` with the Heroku review app URL which can be used in your Pa11y CI config file.
