export class ToolKitError extends Error {
  details?: string
  exitCode?: number
}

export interface ConflictingTask {
  task: string
  plugin: string
}

export interface HookTaskConflict {
  hook: string
  conflictingTasks: ConflictingTask[]
}

export class ToolKitConflictError extends ToolKitError {
  conflicts: HookTaskConflict[]

  constructor(message: string, conflicts: HookTaskConflict[]) {
    super(message)
    this.conflicts = conflicts
  }
}
