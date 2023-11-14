import { ToolKitError } from '@dotcom-tool-kit/error'

export interface Invalid {
  valid: false
  reasons: string[]
}
export interface Valid<T> {
  valid: true
  value: T
}
export type Validated<T> = Invalid | Valid<T>

export function mapValidated<T, U>(validated: Validated<T>, f: (val: T) => U): Validated<U> {
  if (validated.valid) {
    return { valid: true, value: f(validated.value) }
  } else {
    return validated
  }
}

export function mapValidationError<T>(
  validated: Validated<T>,
  f: (reasons: string[]) => string[]
): Validated<T> {
  if (validated.valid) {
    return validated
  } else {
    return { valid: false, reasons: f(validated.reasons) }
  }
}

export function joinValidated<T, U>(first: Validated<T>, second: Validated<U>): Validated<[T, U]> {
  if (first.valid) {
    if (second.valid) {
      return { valid: true, value: [first.value, second.value] }
    } else {
      return second
    }
  } else {
    if (second.valid) {
      return first
    } else {
      return { valid: false, reasons: [...first.reasons, ...second.reasons] }
    }
  }
}

export function reduceValidated<T>(validated: Validated<T>[]): Validated<T[]> {
  let sequenced: Validated<T[]> = { valid: true, value: [] }
  for (const val of validated) {
    if (sequenced.valid) {
      if (val.valid) {
        sequenced.value.push(val.value)
      } else {
        sequenced = { valid: false, reasons: val.reasons }
      }
    } else if (!val.valid) {
      sequenced.reasons.push(...val.reasons)
    }
  }
  return sequenced
}

export function flatMapValidated<T, U>(validated: Validated<T>, f: (val: T) => Validated<U>): Validated<U> {
  if (validated.valid) {
    return f(validated.value)
  } else {
    return validated
  }
}

export function unwrapValidated<T>(validated: Validated<T>, message = ''): T {
  if (validated.valid) {
    return validated.value
  } else {
    const error = new ToolKitError(message)
    error.details = validated.reasons.join('\n\n')
    throw error
  }
}
