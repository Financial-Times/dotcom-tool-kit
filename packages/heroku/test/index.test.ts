import { describe, it, expect } from '@jest/globals'
import * as heroku from '../'

describe('Heroku plugin', () => {
  it('should define Heroku build lifecycles', () => {
    expect(heroku.lifecycles).toEqual(
      expect.objectContaining({
        'build:remote': expect.any(Function),
        'release:remote': expect.any(Function)
      })
    )
  })
})
