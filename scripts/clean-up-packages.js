#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const { Confirm } = require('enquirer')
const rmRf = require('rimraf')

const packagesToDelete = fs.readdirSync('packages').filter((pkg) => {
  return !fs.existsSync(path.join('packages', pkg, 'package.json'))
})

if (packagesToDelete.length > 0) {
  console.log('These package folders were found without a package.json:')
  console.log(packagesToDelete.map((pkg) => `- ${pkg}`).join('\n') + '\n')
  console.log('They were probably left over when switching branches.')
  console.log('Keeping them will cause issues with the test suite and other repo tooling!\n')

  const prompt = new Confirm({ message: 'delete them?' })

  prompt.run().then((result) => {
    if (result) {
      console.log('cool\n')
      for (const pkg of packagesToDelete) {
        console.log(`deleting ${pkg}`)
        rmRf.sync(path.join('packages', pkg))
      }
    }
  })
}
