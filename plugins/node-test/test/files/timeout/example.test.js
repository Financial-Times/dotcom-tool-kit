const assert = require('node:assert/strict')
const { describe, it } = require('node:test')
const { setTimeout } = require('node:timers/promises')

describe('passing test suite', () => {
  it('has tests that pass', async () => {
    await setTimeout(1000);
    assert.ok(true)
  })
})
