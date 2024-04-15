// uses Symbol.for, not Symbol, so that they're compatible across different
// @dotcom-tool-kit/base instances

// TODO these symbols say '@dotcom-tool-kit/types' because they used to live
// in that package. changing that would be a backwards compatibility nightmare

// used as the name for the property we use to identify classes
export const typeSymbol = Symbol.for('@dotcom-tool-kit/types')

// used to identify the Base, Task and Hook classes
export const baseSymbol = Symbol.for('@dotcom-tool-kit/types/base')
export const taskSymbol = Symbol.for('@dotcom-tool-kit/types/task')
export const hookSymbol = Symbol.for('@dotcom-tool-kit/types/hook')
export const initSymbol = Symbol.for('@dotcom-tool-kit/types/init')
