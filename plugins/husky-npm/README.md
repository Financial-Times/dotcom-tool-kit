# @dotcom-tool-kit/husky-npm

A plugin to add git hooks to your project via [husky](https://typicode.github.io/husky/#/). These hooks can be configured with different tasks as your project requires.

## Installation

With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

```sh
npm install --save-dev @dotcom-tool-kit/husky-npm
```

And add it to your repo's `.toolkitrc.yml`:

```yaml
plugins:
    - '@dotcom-tool-kit/husky-npm'
```

Install this plugin's hooks:

```sh
npx dotcom-tool-kit --install
```

## Options

none

## Hooks

| Event | Description | Installed to...| Default tasks |
|-|-|-|-|
| `git:precommit` | installs git's pre-commit hook | package.json  | `LintStaged`, `SecretSquirrel` |
| `git:commitmsg` | installs git's commit-msg hook | package.json  | none |
