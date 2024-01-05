import type { Plugin } from '../../types/src/index'

export interface Conflict<T> {
  plugin: Plugin
  conflicting: T[]
}

export function isConflict<T>(thing: unknown): thing is Conflict<T> {
  return Boolean((thing as Conflict<T>).conflicting)
}

export function findConflictingEntries<T, U>(
  items: Record<string, U | Conflict<T>>
): [string, Conflict<T>][] {
  return Object.entries(items).filter((entry): entry is [string, Conflict<T>] => isConflict(entry[1]))
}

export function findConflicts<T, U>(items: (U | Conflict<T>)[]): Conflict<T>[] {
  const conflicts: Conflict<T>[] = []

  for (const item of items) {
    if (isConflict<T>(item)) {
      conflicts.push(item)
    }
  }

  return conflicts
}

export function withoutConflicts<T, U>(items: (U | Conflict<T>)[]): U[] {
  const nonConflicts: U[] = []

  for (const item of items) {
    if (!isConflict<T>(item)) {
      nonConflicts.push(item)
    }
  }

  return nonConflicts
}
