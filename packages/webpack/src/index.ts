import WebpackDevelopment from './commands/webpack/development'
import WebpackProduction from './commands/webpack/production'

export const commands = {
  'webpack:development': WebpackDevelopment,
  'webpack:production': WebpackProduction
}
