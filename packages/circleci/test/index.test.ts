import { describe, it, expect } from '@jest/globals'
import * as circleci from '../'

describe('CircleCI plugin', () => {
  it('should define CI lifecycles', () => {
    expect(circleci.lifecycles).toEqual(
      expect.objectContaining({
        'build:ci': expect.any(Function),
        'test:ci': expect.any(Function),
        'test:remote': expect.any(Function)
      })
    )
  })
})
