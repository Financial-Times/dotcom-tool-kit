const assert = require('node:assert/strict')
const { describe, it } = require('node:test')

describe('failing test suite', () => {
  it('has tests that fail', () => {
    assert.ok(false)
  })
})
