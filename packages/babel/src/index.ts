import BabelDevelopment from './commands/babel/development'
import BabelProduction from './commands/babel/production'

export const commands = {
  'babel:development': BabelDevelopment,
  'babel:production': BabelProduction
}
