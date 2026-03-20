const assert = require('node:assert/strict')
const { describe, it } = require('node:test')

describe("passing test suite (CJS)", () => {
  it('has tests that pass', () => {
    assert.ok(true)
  })
})
