#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const name = process.argv[2]
const camelCaseName = name.replace(/(^|-)./g, (char) => char.slice(-1).toUpperCase())
const directory = path.join('packages', name)

console.log(`📂 creating folder ${directory}`)
fs.mkdirSync(directory)
process.chdir(directory)

console.log('📦 initialising package')
execSync('npm init -y --scope @dotcom-tool-kit')

console.log('📥 installing dependencies')
execSync('npm install @oclif/command')
execSync('npm install --save-dev @oclif/dev-cli typescript')

console.log('🔣 adding metadata to package.json')

const pkg = JSON.parse(fs.readFileSync('package.json'))

pkg.scripts = {
  prepack: 'tsc -b && oclif-dev manifest',
  postpack: 'rm -f oclif.manifest.json'
}
pkg.oclif = { commands: './lib/commands' }
pkg.files = ['/lib']
pkg.version = '0.0.0-development'
pkg.repository = {
  type: 'git',
  url: 'https://github.com/financial-times/dotcom-tool-kit.git',
  directory
}
pkg.bugs = 'https://github.com/financial-times/dotcom-tool-kit/issues'
pkg.homepage = `https://github.com/financial-times/dotcom-tool-kit/tree/main/${directory}`
pkg.author = 'FT.com Platforms Team <platforms-team.customer-products@ft.com>'

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
