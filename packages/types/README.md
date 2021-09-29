# Tool Kit Option Schemas

## Overview

Tool Kit allows plugins to take options from a `.toolkitrc.yml` file. Each
plugin has a different set of options that it can expect to get, and this
package defines the shape of these options. It does that via a schema object
defined for each of the plugins that take options. This is currently being used
primarily so that the user can be prompted for these options via the command
line interface used by the `create` package, though they could also be used to
verify options specified in a config file in the future.

Seeing as JavaScript does not have any runtime concept of types, we instead
define the types by string literals which can then be parsed at runtime
(allowances have been made to make parsing easier so some syntax forms might
look a little odd.) For example, a schema could look like this:

```typescript
const ExampleSchema = {
  files: 'string',
  retryCount: 'number?'
} as const
```

which would define a set of options where it is expected a `files` string will
be specified, and a number field can be optionally specified for a `retryCount`.

## Schema Type Reference

In this table, `A` and `B` can be substituted by any of the first four types
(unfortunately TypeScript does not seem to support recursive conditional types
right now.) `T` can be any type, with a `?` suffix denoting an optional type.

| Syntax       | Type                |
| ------------ | ------------------- |
| `"string"`   | `string`            |
| `"number"`   | `number`            |
| `"boolean"`  | `boolean`           |
| `"unknown"`  | `unknown`           |
| `"array.A"`  | `A[]`               |
| `"record.A"` | `Record<string, A>` |
| `"\|A,B"`    | `A \| B`            |
| `"T?"`       | `T \| undefined`    |

## TypeScript Helpers

All schemas should use the TypeScript type `Schema`. This will make sure that
there aren't any typos in the schema and that is structured correctly. It also
allows you to make use of the `SchemaOutput` type, a special generic type that
can be used to extract the type of the object that is successfully validated by
the schema. For instance, you could use the type inferred by the `ExampleSchema`
declaration above as the type parameter for `SchemaOutput` like so:

```typescript
type ExampleOutput = SchemaOutput<typeof ExampleSchema>
```

which would create a type equivalent to

```typescript
type ExampleOutput = {
  files: string
  retryCount?: number
}
```

This can be very useful when you don't want to have your options defined in two
different forms which you have to remember to keep in sync with each other
whenever you make any changes!

One gotcha to look out for is to make sure you cast any schema object you define
as constant with the `as const` assertion. This restricts TypeScript from
'widening' the types, i.e., treating a literal field with value `"number"` as a
`string` rather than as having type `"number"`, which the `SchemaOutput` depends
on for its conditional typing.

## Integrating Into Code

The `Task` class, which all tasks must inherit, takes a `Schema` as a type
parameter. It then uses `SchemaOutput` to ascertain the type of the options that
are actually stored for the task. You should pass a `Schema` to `Task` if your
plugin takes options, but it is safe to ignore this type parameter if your
plugin does not.

You should also follow the convention of storing your schema at `<tool kit root>/packages/types/schema/<package name>.ts`, and export it from the module as
`Schema`. This allows the `create` package to dynamically read the schema and
prompt the user for options to set when they are initialising Tool Kit and its
plugins.
