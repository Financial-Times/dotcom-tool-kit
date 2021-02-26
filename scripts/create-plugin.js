#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const name = process.argv[2]
const camelCaseName = name.replace(/(^|-)./g, (char) => char.slice(-1).toUpperCase())
const dir = path.join('packages', name)

console.log(`📂 creating folder ${dir}`)
fs.mkdirSync(dir)
process.chdir(dir)

console.log('📦 initialising package')
execSync('npm init -y --scope @dotcom-tool-kit')

console.log('📥 installing @oclif/command')
execSync('npm install @oclif/command')

console.log('🔣 adding oclif metadata to package.json')
const pkg = JSON.parse(fs.readFileSync('package.json'))
pkg.oclif = { commands: './lib/commands' }
pkg.files = ['/lib']
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))

console.log('⛓ linking tsconfig')
fs.symlinkSync('../../tsconfig.json', 'tsconfig.json')

console.log(`🏗 scaffolding command ${camelCaseName}`)
fs.mkdirSync('src/commands', { recursive: true })

fs.writeFileSync(
  `src/commands/${name}.ts`,
  `import { Command } from '@oclif/command'

export default class ${camelCaseName} extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {

   }
}`
)

console.log('🌊 byeee~')
