import type { Plugin } from './plugin'

export interface Conflict<T> {
   plugin: Plugin,
   conflicting: T[]
}

export function isConflict<T>(thing: any): thing is Conflict<T> {
   return thing.conflicting != null
}

export function findConflicts<T, U>(items: (U | Conflict<T>)[]): Conflict<T>[] {
   const conflicts:Conflict<T>[] = []

   for(const item of items) {
      if(isConflict<T>(item)) {
         conflicts.push(item)
      }
   }

   return conflicts
}
