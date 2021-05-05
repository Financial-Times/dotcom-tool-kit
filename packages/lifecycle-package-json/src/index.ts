import loadPackageJson from '@financial-times/package-json'
import type { PackageJson } from '@financial-times/package-json'
import path from 'path'

type Scripts = {
  [script: string]: string
}

export abstract class PackageJsonLifecycleInstaller {
  _packageJson?: PackageJson
  abstract script: string
  abstract command: string

  get packageJson() {
     if(!this._packageJson)  {
        const filepath = path.resolve(process.cwd(), 'package.json')
        this._packageJson = loadPackageJson({ filepath })
     }

     return this._packageJson
  }

  async check() {
     const scripts = this.packageJson.getField<Scripts>('scripts')
     return scripts && scripts[this.script] === this.command
  }

  async install() {
     this.packageJson.requireScript({
       stage: this.script,
       command: this.command
     })

     this.packageJson.writeChanges()
  }
}
