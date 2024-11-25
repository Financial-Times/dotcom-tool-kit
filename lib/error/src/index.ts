export class ToolKitError extends Error {
  name = 'ToolKitError'
  details?: string
  exitCode?: number
}

export interface ConflictingTask {
  task: string
  plugin: string
}

export interface CommandTaskConflict {
  command: string
  conflictingTasks: ConflictingTask[]
}

export class ToolKitConflictError extends ToolKitError {
  conflicts: CommandTaskConflict[]

  constructor(message: string, conflicts: CommandTaskConflict[]) {
    super(message)
    this.conflicts = conflicts
  }
}

export function hasToolKitConflicts(error: unknown): error is ToolKitConflictError {
  return error instanceof ToolKitConflictError && error.conflicts.length > 0
}
