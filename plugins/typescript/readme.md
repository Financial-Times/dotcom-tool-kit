# @dotcom-tool-kit/typescript

Tool Kit plugin to build [TypeScript](https://www.typescriptlang.org) code

## Installation & Usage

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/typescript
```

And add it to your repo's `.toolkitrc.yml`:

```yml
plugins:
  - '@dotcom-tool-kit/typescript'
```

## Options

| Key | Description | Default value |
|-|-|-|
| `configPath` | Path to the [TypeScript config file](https://www.typescriptlang.org/tsconfig) | use TypeScript's own [tsconfig.json resolution](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#using-tsconfigjson-or-jsconfigjson) |
| `extraArgs` | Extra [arguments](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to pass to the tsc CLI that can't be set in `tsconfig.json` | `[]`

## Tasks

| Task | Description | Preconfigured hook |
|-|-|-|
| `TypeScriptBuild` | runs `tsc` to compile TypeScript to JavaScript | `build:local` |
| `TypeScriptWatch` | rebuild project on every project file change | `run:local` |
| `TypeScriptTest` | type check TypeScript code without emitting code | `test:local` |
