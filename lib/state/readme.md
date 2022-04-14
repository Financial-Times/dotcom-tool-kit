# @dotcom-tool-kit/state

This package allows Tool Kit plugins to persist data about the environment between Tool Kit runs.

## API

### State schema

The schema for the state is described in the [`State` interface](./src/index.ts#L33). The state is an object, with keys representing different stages during e.g. a CI workflow, and values the different data that might be needed for those stages.

The state is stored in a `.toolkitstate` directory in the repo running Tool Kit as individual JSON files.

### `readState(stage)`

Reads the state file for the stage you give it and returns that state object, or `null` if there's no state stored.

This function is synchronous/blocking and should be called sparingly.

### `writeState(stage, value)`

Writes an object to the state file for the stage, merging with any existing state. If the state folder or file for this stage don't exist, it will create them. Returns the full merged state object.

This function is synchronous/blocking and should be called sparingly.
