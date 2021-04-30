import loadPackageJson from '@financial-times/package-json'
import type { PackageJson } from '@financial-times/package-json'
import path from 'path'

type Scripts = {
   [script: string]: string
}

class BuildCI {
   async check() {
      return false
   }

   async install() {
      console.log('installing build:ci')
   }
}

class BuildLocal {
   script = 'dotcom-tool-kit lifecycle build:local'
   _packageJson?: PackageJson

   get packageJson() {
      if(!this._packageJson)  {
         const filepath = path.resolve(process.cwd(), 'package.json')
         this._packageJson = loadPackageJson({ filepath })
      }

      return this._packageJson
   }

   async check() {
      const scripts = this.packageJson.getField<Scripts>('scripts')
      return scripts && scripts.build === this.script
   }

   async install() {
      this.packageJson.requireScript({
        stage: 'build',
        command: this.script
      })

      this.packageJson.writeChanges()
   }
}

class BuildDeploy {
   async check() {
      return false
   }

   async install() {
      console.log('installing build:deploy')
   }
}

export const lifecycles = {
   'build:local': BuildLocal,
   'build:ci': BuildCI,
   'build:deploy': BuildDeploy
}
