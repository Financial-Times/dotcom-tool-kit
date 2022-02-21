import { describe, it, expect } from '@jest/globals'
import { hooks } from '../'

describe('npm plugin', () => {
  it('should define package.json hooks', () => {
    expect(hooks).toEqual(
      expect.objectContaining({
        'publish:tag': expect.any(Function)
      })
    )
  })
})
