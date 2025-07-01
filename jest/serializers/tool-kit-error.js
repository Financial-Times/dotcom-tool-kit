module.exports = {
  test(value) {
    return value instanceof Error && value.constructor.name === 'ToolKitError'
  },

  serialize(val, config, indentation, depth, refs, printer) {
    return `${printer(val.name, config, indentation, depth, refs)} ${printer(
      val.message,
      config,
      indentation,
      depth,
      refs
    )} ${printer({ details: val.details }, config, indentation, depth, refs)}`
  }
}
