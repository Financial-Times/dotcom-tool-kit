import { describe, it, expect } from '@jest/globals'
import * as circleciHeroku from '../'

describe('CircleCI-Heroku plugin', () => {
  it('should define CI deployment lifecycles', () => {
    expect(circleciHeroku.lifecycles).toEqual(
      expect.objectContaining({
        'deploy:review': expect.any(Function),
        'deploy:staging': expect.any(Function),
        'deploy:production': expect.any(Function)
      })
    )
  })
})
