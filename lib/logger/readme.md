# @dotcom-tool-kit/logger

Utilities for instrumenting Tool Kit plugins for structured logging, including a base [Winston](https://github.com/winstonjs/winston) logger and formatting functions.

## API

### `rootLogger`

An instance of `winston.Logger` set up to use the default Tool Kit [formatter](#format) and console transport. Used internally by [`core/cli`](../../core/cli).

### `format`

An instance of `winston.Logform.Format` based on `winston.format.printf` that formats certain types of messages with Tool Kit's [styles](#styles) and adds metadata for the hook, task, or subprocess that's running. Used by [`rootLogger`](#rootlogger).

### `styles`

An object containing styling use case functions, based on [`ansi-colors`](https://github.com/doowb/ansi-colors). Instead of using `ansi-colors` directly, we define styles, to keep logging consistent.

The following style functions are available, accepting a string argument and returning a formatted string:

| Style | Appearence | Use case |
|-|-|-|
| `hook` | <img width="116" alt="test:local in a magenta monospace font" src="https://user-images.githubusercontent.com/631757/163168637-803d912c-b455-4c5e-acb2-ef1a393e06b2.png"> | Names of hooks |
| `task` | <img width="205" alt="WebpackDevelopment in a blue monospace font" src="https://user-images.githubusercontent.com/631757/163168799-581e94d6-be23-45f2-b15b-229d0de93519.png"> | Names of tasks |
| `plugin` | <img width="52" alt="jest in a cyan monospace font" src="https://user-images.githubusercontent.com/631757/163168933-9e6d2271-6b3c-48a1-9a16-0ee3059a3879.png"> | Names of plugins |
| `URL` | <img width="210" alt="https://www.ft.com in an underlined cyan monospace font" src="https://user-images.githubusercontent.com/631757/163169105-c233f9fa-0b24-4fb5-9ef8-fdc2a6bc30bb.png"> | URLs |
| `filepath` | <img width="192" alt="~/dotcom-tool-kit in an italic monospace font" src="https://user-images.githubusercontent.com/631757/163170062-e6aa1915-6e96-423b-b6f3-afde611300bf.png"> | File paths |
| `app` | <img width="140" alt="next-article in a green monospace font" src="https://user-images.githubusercontent.com/631757/163170197-586266b2-caeb-4624-80a7-e95c6b87e325.png"> | Name of the repo using Tool Kit |
| `option` | <img width="116" alt="image" src="https://user-images.githubusercontent.com/631757/163170424-839f611a-260a-4da5-aab1-195a9d4535b7.png"> | Name of a plugin option |
| `makeTarget` | <img width="69" alt="smoke in a light grey italic monospace font" src="https://user-images.githubusercontent.com/631757/163170625-3e0db293-9bc6-4f32-b5ae-36fcdf6ac123.png"> | Name of a `Makefile` target when migrating from `n-gage` |
| `heading` | <img width="94" alt="Tool Kit in a bold monospace font" src="https://user-images.githubusercontent.com/631757/163192797-32ceacae-5e5c-40c1-a300-32738ce98da5.png"> | Heading text |
| `dim` | <img width="201" alt="unimportant detail in a grey monospace font" src="https://user-images.githubusercontent.com/631757/163193451-e0170a30-59b6-4708-8e87-fdc4f26cb1e0.png"> | Deliberately deemphasised text |
| `title` | <img width="85" alt="Welcome in a bold, underlined monospace font" src="https://user-images.githubusercontent.com/631757/163195331-da46041b-7a4b-4c6c-9baa-f5335fd6fc37.png"> | Title text |
| `errorHighlight` | <img width="21" alt="‼︎ in a red font" src="https://user-images.githubusercontent.com/631757/163195608-2f123d0d-e4a5-47fb-945a-962f316b197b.png"> | Accent colour for error messages |
| `error` | <img width="252" alt="‼︎ something went wrong in a bold underlined monospace font. ‼︎ is red" src="https://user-images.githubusercontent.com/631757/163195740-c6cb5f90-3363-4890-9456-11523e292e97.png"> | Error messages |
| `warningHighlight` | <img width="20" alt="⚠︎ in a yellow font" src="https://user-images.githubusercontent.com/631757/163196131-72b7ace5-3189-45b7-855b-773b80d48d73.png"> | Accent colour for warning messages |
| `warning` | <img width="232" alt="⚠︎ something to check in a monospace font. the ⚠︎ is yellow" src="https://user-images.githubusercontent.com/631757/163196064-5bff1cf0-dd8c-41b7-93b4-d16ced3c4469.png"> | Warning messages |
| `ruler` | <img width="213" alt="a horizontal line drawn with Unicode Box Drawing characters" src="https://user-images.githubusercontent.com/631757/163196596-87a8e5f8-48e7-48f5-bc08-5115f4318096.png"> | Dividing line between messages |

### `hookConsole`

Wraps `process.stdout` and `process.stderr` `write` methods so output from third-party libraries is wrapped with our logger. Takes an instance of a logger, and a prefix label to print on wrapped logs. Returns a function to unwrap the output streams.

```javascript
const unhook = hookConsole(logger, 'label')
// ...do things that will print to console
unhook()
```

### `hookFork`

Wraps a child process's output with our logger. Takes a logger instance, a prefix label, and a `ChildProcess`.

```javascript
const child = fork(/* ... */)
hookFork(logger, 'child process', child)
```

### `waitOnExit`

Waits for a child process to exit, and if it returns a nonzero exit code, rejects with a [`ToolKitError`](../error). Takes a label to print with the error message and a `ChildProcess` and returns a `Promise` that resolves or rejects when the process exits.

```javascript
const child = fork(/* ... */)
await waitOnExit('child process', child)
```
