module.exports = {
  test(value) {
    return value instanceof Error && value.name === 'AggregateError'
  },

  serialize(val, config, indentation, depth, refs, printer) {
    return `AggregateError ${printer(val.message, config, indentation, depth, refs)} ${printer(
      { errors: val.errors },
      config,
      indentation,
      depth,
      refs
    )}`
  }
}
