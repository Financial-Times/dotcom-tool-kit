import { describe, it, expect } from '@jest/globals'
import * as npm from '../'

describe('npm plugin', () => {
  it('should define package.json hooks', () => {
    expect(npm.hooks).toEqual(
      expect.objectContaining({
        'build:local': expect.any(Function),
        'test:local': expect.any(Function)
      })
    )
  })
})
