import { ToolKitError } from '@dotcom-tool-kit/error'

interface Mixin<T> {
  map<U>(f: (val: T) => U): Validated<U>
  mapError(f: (reasons: string[]) => string[]): Validated<T>
  flatMap<U>(f: (val: T) => Validated<U>): Validated<U>
  awaitValue(): Promise<Validated<Awaited<T>>>
  unwrap(message?: string): T
}

export type Invalid = {
  valid: false
  reasons: string[]
}

export type Valid<T> = {
  valid: true
  value: T
}

export type Validated<T> = (Invalid | Valid<T>) & Mixin<T>

export const invalid = <T>(reasons: string[]) => mixin<T>({ valid: false, reasons })
export const valid = <T>(value: T) => mixin({ valid: true, value })

const mixin = <T>(validated: Invalid | Valid<T>): Validated<T> => ({
  ...validated,

  map(f) {
    if (validated.valid) {
      return valid(f(validated.value))
    } else {
      return invalid(validated.reasons)
    }
  },

  mapError(f) {
    if (validated.valid) {
      return mixin(validated)
    } else {
      return invalid(f(validated.reasons))
    }
  },

  flatMap(f) {
    if (validated.valid) {
      return f(validated.value)
    } else {
      return mixin(validated)
    }
  },

  unwrap(message = '') {
    if (validated.valid) {
      return validated.value
    } else {
      const error = new ToolKitError(message)
      error.details = validated.reasons.join('\n\n')
      throw error
    }
  },

  async awaitValue() {
    if (validated.valid) {
      return valid(await validated.value)
    } else {
      return invalid(validated.reasons)
    }
  }
})

export function reduceValidated<T>(validated: Validated<T>[]): Validated<T[]> {
  let sequenced: Validated<T[]> = valid([])
  for (const val of validated) {
    if (sequenced.valid) {
      if (val.valid) {
        sequenced.value.push(val.value)
      } else {
        sequenced = invalid(val.reasons)
      }
    } else if (!val.valid) {
      sequenced.reasons.push(...val.reasons)
    }
  }
  return sequenced
}
