# Tool Kit

...is a modern approach to developer tooling for FT.com applications and components. The tools are **modular**: projects with different requirements can install different sets of plugins, which are all surfaced through a single command-line interface.

Tool Kit is under active develpment. Anything can and probably will change.

## Development

Tool Kit is a monorepo. The [`packages`](/packages) folder contains several different parts published separately to `npm`. [`packages/cli`](/packages/cli) is the main entry point, which uses [`packages/oclif-plugin-app-plugins`](/packages/oclif-plugin-app-plugins) to load the plugins required by a consumer.

Tool Kit requires Node v12. To install the dependencies and link internal packages together, run:

```sh
npm install
```

There's a testing sandbox at [`packages/test`](/packages/test) with Tool Kit installed as a dependency. In that directory, you can run `npx dotcom-tool-kit help` to see what commands are available.

Tool Kit is implemented with [Oclif](https://oclif.io/), the Open CLI Framework, and written in Typescript. Tool Kit commands are implemented as Oclif plugins.

In the future, there will be unit and integration tests for every package.

## How does Tool Kit relate to...

### n-gage/n-heroku-tools

Tool Kit is a replacement for these tools built on modern, reliable, testable technologies.

### Page Kit

Page Kit provides common page-level components and an asset pipeline for user-facing FT.com applications. Tool Kit complements this by providing tooling to manage the application while developing.
