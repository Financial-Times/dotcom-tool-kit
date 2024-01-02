# `@dotcom-tool-kit/validated`

Types and functions for an errors-as-first-class-values pattern

## Rationale

In Tool Kit, we handle loading many plugins with different types of entry point (for `Task`s, `Hook`s etc) in parallel. There are various points this process could go wrong: importing an entry point, checking version compatibility, and more.

If we naïvely used exception throwing or Promise rejections, Tool Kit would stop at the first problem that happened; the user would fix that only to run into the next error, which would be frustrating. We want to get as far as we can and collect all the errors that happen to present _once_, as late as possible.

We _could_ still use exceptions/rejections for this, along with `Promise.allSettled`. However, with that pattern it would be difficult to follow the data flow of the errors, and easy to accidentally forget to collate some errors, falling into the same issue of throwing one error at a time.

Instead, we model these errors using an explicit return value, `Validated<T>`. This type is a union of `Valid<T>` which represents a correct value, and `Invalid` which represents a problem with a list of `string` reasons. By making this an explicit type, we clearly mark all the functions that can return errors we may want to collate, and make it impossible to use the values without deciding what to do with the errors.

This pattern is modelled after Go's [error handling using multiple return values](https://go.dev/doc/tutorial/handle-errors), Rust's [`Result<T, E>` type](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html) and Haskell's [`Either a b` type](https://hackage.haskell.org/package/base-4.19.0.0/docs/Data-Either.html).

## Usage

### Creating a `Validated`

`@dotcom-tool-kit/validated` exports two constructor functions, `valid` and `invalid`. Use these to create a wrapper when the status of the value is known, e.g.:

```typescript
valid({ some: 'object' })

invalid([
	'list of problems'
])
```

### Using `Validated` values

`Validated` objects have methods that are similar to the Array or Promise methods, allowing you to do things with the values or error reasons without having to inspect the types:

```typescript
validated.map(value => {
	// do something with value
	return // something else. replaces the value with this return value if valid, does nothing if invalid
})

validated.mapError(reasons => {
	// do something with reasons
	return // something else. replaces the reasons with this return value if invalid, does nothing if valid
})
```

### Extracting values from a `Validated`

`Validated` has an `.unwrap` method that allows you to extract its value if valid, or throws an error with its reasons if invalid. This should be used as late as possible, when you can't get any further without the value, and need to stop if it's invalid.

```typescript
validated.unwrap('something was invalid!')
```

### Grouping an array of `Validated`

Similar to `Promise.all`, if you have multiple `Validated`s and you need to group their values and reasons (i.e. you have `Array<Validated<T>>` and you want `Validated<Array<T>>`), we have `reduceValidated`:

```typescript
reduceValidated([
	validated1,
	validated2,
	validated3
])
```

This is used in Tool Kit when e.g. we load multiple plugins in parallel.
