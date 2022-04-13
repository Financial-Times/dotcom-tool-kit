# @dotcom-tool-kit/error

Error subclasses for providing user-friendly messages from Tool Kit plugins

## API

### `ToolKitError`

A subclass of `Error` with optional `details` and `exitCode` properties. When [`core/cli`](../../core/cli) catches a `ToolKitError`, it will print the error message and details with nice formatting, and exit the process with the code provided as `exitCode` (defaulting to `1`):

```js
import { ToolKitError } from '@dotcom-tool-kit/error'

// somewhere in plugin code:
const error = new ToolKitError('something went wrong')
error.details = `here's what you can do to fix it`
error.exitCode = 137
```

This will exit the process, and print:

```
‼︎ something went wrong
───────────────────────────────────────
here's what you can do to fix it
```

### `ToolKitConflictError`

A subclass of `ToolKitError` with a `conflicts` property. Used by the Tool Kit plugin loader to message about errors with conflicts between tasks.
