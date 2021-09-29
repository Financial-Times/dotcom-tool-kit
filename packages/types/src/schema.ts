export type ScalarSchemaType = 'string' | 'number' | 'boolean' | `|${string},${string}` | 'unknown'
export type SchemaType = ScalarSchemaType | `array.${ScalarSchemaType}` | `record.${ScalarSchemaType}`
export type ModifiedSchemaType = SchemaType | `${SchemaType}?`

export type Schema = {
  readonly [option: string]: ModifiedSchemaType
}

// Achieve the mapping with conditional types
type SchemaTypeOutput<T extends SchemaType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends `|${infer A},${infer B}`
  ? A | B
  : T extends 'unknown'
  ? unknown
  : T extends `array.${infer S}`
  ? S extends SchemaType
    ? Array<SchemaTypeOutput<S>>
    : never
  : T extends `record.${infer S}`
  ? S extends SchemaType
    ? Record<string, SchemaTypeOutput<S>>
    : never
  : never

export type SchemaOutput<T extends Schema> = {
  -readonly [option in keyof T as T[option] extends SchemaType
    ? option
    : never]-?: T[option] extends SchemaType ? SchemaTypeOutput<T[option]> : never
} &
  {
    -readonly [option in keyof T as T[option] extends `${string}?`
      ? option
      : never]?: T[option] extends `${infer S}?`
      ? S extends SchemaType
        ? SchemaTypeOutput<S>
        : never
      : never
  }
