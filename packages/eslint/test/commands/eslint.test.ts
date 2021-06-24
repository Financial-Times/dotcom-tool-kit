import * as path from 'path'
import ESLint from '../../src/commands/eslint'

const testDirectory = path.join(__dirname, '../files')

describe('eslint', () => {
  it('should pass on correct file', async () => {
    const command = new ESLint([], {} as any)
    command.options.config = { ignore: false }
    command.options.files = path.join(testDirectory, 'pass.ts')
    await command.run()
  })

  it('should fail on linter error', async () => {
    const command = new ESLint([], {} as any)
    command.options.config = { ignore: false }
    command.options.files = path.join(testDirectory, 'fail.ts')

    expect.assertions(1)
    try {
      await command.run()
    } catch (err) {
      expect(err.details).toContain('2 problems (1 error, 1 warning)')
    }
  })
})
