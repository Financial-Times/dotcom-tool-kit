import { describe, it, expect } from '@jest/globals'
import * as circleci from '../'

describe('CircleCI plugin', () => {
  it('should define CI hooks', () => {
    expect(circleci.hooks).toEqual(
      expect.objectContaining({
        'build:ci': expect.any(Function),
        'test:ci': expect.any(Function),
        'test:remote': expect.any(Function)
      })
    )
  })
})
