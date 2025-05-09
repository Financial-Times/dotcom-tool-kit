import { ToolKitError } from '@dotcom-tool-kit/error'

interface Mixin<T, E> {
  map<U>(f: (val: T) => U): Validated<U, E>
  mapError<U>(f: (reasons: E[]) => U[]): Validated<T, U>
  flatMap<U>(f: (val: T) => Validated<U, E>): Validated<U, E>
  awaitValue(): Promise<Validated<Awaited<T>, E>>
  unwrap(message?: string): T
}

export type Invalid<E = string> = {
  valid: false
  reasons: E[]
}

export type Valid<T> = {
  valid: true
  value: T
}

export type Validated<T, E = string> = (Valid<T> | Invalid<E>) & Mixin<T, E>

export const invalid = <T, E = string>(reasons: E[]) => mixin<T, E>({ valid: false, reasons })
export const valid = <T, E = string>(value: T) => mixin<T, E>({ valid: true, value })

const mixin = <T, E>(validated: Valid<T> | Invalid<E>): Validated<T, E> => ({
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

export function reduceValidated<T, E = string>(validated: Validated<T, E>[]): Validated<T[], E> {
  let sequenced: Validated<T[], E> = valid([])
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
