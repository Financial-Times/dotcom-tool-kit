dotcom-tool-kit
===============

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dotcom-tool-kit.svg)](https://npmjs.org/package/dotcom-tool-kit)
[![Downloads/week](https://img.shields.io/npm/dw/dotcom-tool-kit.svg)](https://npmjs.org/package/dotcom-tool-kit)
[![License](https://img.shields.io/npm/l/dotcom-tool-kit.svg)](https://github.com/financial-times/dotcom-tool-kit/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dotcom-tool-kit
$ dotcom-tool-kit COMMAND
running command...
$ dotcom-tool-kit (-v|--version|version)
dotcom-tool-kit/0.0.0 darwin-x64 node-v15.4.0
$ dotcom-tool-kit --help [COMMAND]
USAGE
  $ dotcom-tool-kit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dotcom-tool-kit gtg --app [APP]`](#dotcom-tool-kit-gtg---app-app)
* [`dotcom-tool-kit hello [FILE]`](#dotcom-tool-kit-hello-file)
* [`dotcom-tool-kit help [COMMAND]`](#dotcom-tool-kit-help-command)

## `dotcom-tool-kit gtg --app [APP]`

Runs gtg ('good to go') checks for a Heroku app by hitting its `/__gtg` endpoint every three seconds until it receives an OK response. If there is no OK response after two minutes then it will give up.

```
USAGE
  $ dotcom-tool-kit gtg --app [APP]

OPTIONS
  -a, --app        Name of Heroku app to check

EXAMPLE
  $ dotcom-tool-kit gtg --app ft-next-health-eu

  ⏳ polling: http://ft-next-health-eu.herokuapp.com/__gtg
  ❌ http://ft-next-health-eu.herokuapp.com/__gtg not ok
  ⏳ polling: http://ft-next-health-eu.herokuapp.com/__gtg
  ❌ http://ft-next-health-eu.herokuapp.com/__gtg not ok
  ⏳ polling: http://ft-next-health-eu.herokuapp.com/__gtg
  ✅ http://ft-next-health-eu.herokuapp.com/__gtg ok!
```

_See code: [src/commands/gtg.ts](https://github.com/financial-times/dotcom-tool-kit/blob/v0.0.0/src/commands/gtg.ts)_

## `dotcom-tool-kit hello [FILE]`

describe the command here

```
USAGE
  $ dotcom-tool-kit hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dotcom-tool-kit hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/financial-times/dotcom-tool-kit/blob/v0.0.0/src/commands/hello.ts)_

## `dotcom-tool-kit help [COMMAND]`

display help for dotcom-tool-kit

```
USAGE
  $ dotcom-tool-kit help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
