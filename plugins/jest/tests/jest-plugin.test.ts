import { fork } from 'child_process'
import JestLocal from '../src/tasks/local'
import JestCI from '../src/tasks/ci'
import EventEmitter from 'events'

jest.mock('child_process', () => ({
    fork: jest.fn(() => {
      // return a fake emitter that immediately sends an "exit" event, so the jest task resolves
      const emitter = new EventEmitter()
      process.nextTick(() => {
        emitter.emit('exit', 0)
      })
      return emitter
    })
}))

describe('jest plugin', () => {
    describe('local', () => {
        it('should call jest cli with configPath if configPath is passed in', async () => {
            const jestLocal = new JestLocal({configPath: './src/jest.config.js'})
            await jestLocal.run()

            expect(fork).toBeCalledWith(expect.any(String), ['', '--config=./src/jest.config.js'])
        })

        it('should call jest cli without configPath by default', async () => {
            const jestLocal = new JestLocal()
            await jestLocal.run()

            expect(fork).toBeCalledWith(expect.any(String), ['', ''])
        })
    })

    describe('ci', () => {
        it('should call jest cli with configPath if configPath is passed in', async () => {
            const jestCI = new JestCI({configPath: './src/jest.config.js'})
            await jestCI.run()

            expect(fork).toBeCalledWith(expect.any(String), ['--ci', '--config=./src/jest.config.js'])
        })

        it('should call jest cli without configPath by default', async () => {
            const jestCI = new JestCI()
            await jestCI.run()

            expect(fork).toBeCalledWith(expect.any(String), ['--ci', ''])
        })
    })
})