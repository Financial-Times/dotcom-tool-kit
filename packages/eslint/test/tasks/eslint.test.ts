import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import ESLint from '../../src/tasks/eslint'

const testDirectory = path.join(__dirname, '../files')

describe('eslint', () => {
  it('should pass on correct file', async () => {
    const task = new ESLint([])
    task.options.config = { ignore: false }
    task.options.files = path.join(testDirectory, 'pass.ts')
    await task.run()
  })

  it('should fail on linter error', async () => {
    const task = new ESLint([])
    task.options.config = { ignore: false }
    task.options.files = path.join(testDirectory, 'fail.ts')

    expect.assertions(1)
    try {
      await task.run()
    } catch (err) {
      expect(err.details).toContain('2 problems (1 error, 1 warning)')
    }
  })
})
