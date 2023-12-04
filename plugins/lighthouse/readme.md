# @dotcom-tool-kit/lighthouse

Tool Kit plugin to run [lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) against a built environment

## Installation & Usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/lighthouse
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/lighthouse'
```

## Options

| Key | Description | Default value |
|-|-|-|
TODO - Wrap and pass through any config from lighthouse types

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `LighthouseRun` | runs lighthouse on a URL | `foo:bar` |
