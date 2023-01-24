import { describe, it, expect } from '@jest/globals'
import * as circleciDeploy from '../'

describe('CircleCI-Deploy plugin', () => {
  it('should define CI deployment hooks', () => {
    expect(circleciDeploy.hooks).toEqual(
      expect.objectContaining({
        'deploy:review': expect.any(Function),
        'deploy:staging': expect.any(Function),
        'deploy:production': expect.any(Function),
        'teardown:staging': expect.any(Function),
        'test:review': expect.any(Function),
        'test:staging': expect.any(Function)
      })
    )
  })
})
