#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const name = process.argv[2]
const camelCaseName = name.replace(/(^|-)./g, (char) => char.slice(-1).toUpperCase())
const directory = path.join('plugins', name)

console.log(`📂 creating folder ${directory}`)
fs.mkdirSync(directory)
process.chdir(directory)

console.log('📦 initialising package')
execSync('npm init -y --scope @dotcom-tool-kit')

console.log('📥 installing dependencies')
execSync('npm install @dotcom-tool-kit/base')

console.log('🔣 adding metadata to package.json')

const pkg = JSON.parse(fs.readFileSync('package.json'))

pkg.main = 'lib'
pkg.version = '0.1.0'
pkg.repository = {
  type: 'git',
  url: 'https://github.com/financial-times/dotcom-tool-kit.git',
  directory
}
pkg.bugs = 'https://github.com/financial-times/dotcom-tool-kit/issues'
pkg.homepage = `https://github.com/financial-times/dotcom-tool-kit/tree/main/${directory}`
pkg.author = 'FT.com Platforms Team <platforms-team.customer-products@ft.com>'
pkg.files = ['/lib', '.toolkitrc.yml']
pkg.engines = {
  node: '18.x || 20.x || 22.x'
}
pkg.peerDependencies = {
  'dotcom-tool-kit': '4.x'
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))

console.log('⌨️ creating tsconfig')
const tsconfig = {
  extends: '../../tsconfig.settings.json',
  compilerOptions: {
    outDir: 'lib',
    rootDir: 'src'
  },
  references: [
    {
      path: '../../lib/base'
    }
  ],
  include: ['src/**/*']
}

fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2))

console.log('📄 adding empty toolkit config')
fs.writeFileSync('.toolkitrc.yml', 'version: 2\n')

console.log('🔗 adding reference to root tsconfig')
const rootTsconfig = JSON.parse(fs.readFileSync('../../tsconfig.json'))
rootTsconfig.references.push({ path: directory })

fs.writeFileSync('../../tsconfig.json', JSON.stringify(rootTsconfig, null, 2))

console.log('🌊 byeee~')
