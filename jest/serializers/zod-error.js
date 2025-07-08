module.exports = {
  test(value) {
    return value instanceof Error && value.name === 'ZodError'
  },

  serialize(val, config, indentation, depth, refs, printer) {
    return `ZodError ${printer(val.issues, config, indentation, depth, refs)}`
  }
}
