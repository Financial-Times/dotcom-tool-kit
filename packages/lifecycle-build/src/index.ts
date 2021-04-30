import loadPackageJson from '@financial-times/package-json'
import type { PackageJson } from '@financial-times/package-json'
import path from 'path'
import YAML from 'yawn-yaml/cjs'
import { promises as fs } from 'fs'
import { build } from '@oclif/command/lib/flags'

type Scripts = {
   [script: string]: string
}

type Step = {
   [step: string]: any
   run?: {
      name: string
      command: string
   } | string
}

class BuildCI {
   _circleConfig?: YAML
   script = 'npx dotcom-tool-kit lifecycle build:ci'

   async getCircleConfig() {
      if(!this._circleConfig) {
         const circleConfigPath = path.resolve(process.cwd(), '.circleci/config.yml')
         const yaml = await fs.readFile(circleConfigPath, 'utf8')
         this._circleConfig = new YAML(yaml)
      }

      return this._circleConfig
   }

   async check(): Promise<boolean> {
      const circleConfig = await this.getCircleConfig()
      const buildSteps = circleConfig.json.jobs?.build?.steps as Step[] | undefined
      if(!buildSteps) {
         return false //??? what to do if the circleci config is something totally unexpected
      }

      for(const step of buildSteps) {
         if(typeof step.run === 'string' && step.run === this.script) {
            return true
         }

         if(typeof step.run === 'object' && step.run.command === this.script) {
            return true
         }
      }

      return false
   }

   async install() {
      // TODO automate this? humans can probably do it better than computers
      // TODO if other lifecycle installers need manual steps, collate those into a single message
      throw new Error('Please update your CircleCI config to run the command `npx dotcom-tool-kit lifecycle build:ci` in the steps of the `build` job')
   }
}

abstract class PackageJsonLifecycleInstaller {
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

class BuildLocal extends PackageJsonLifecycleInstaller {
   script = 'build'
   command = 'dotcom-tool-kit lifecycle build:local'
}

class BuildDeploy extends PackageJsonLifecycleInstaller {
   script = 'heroku-postbuild'
   command = 'dotcom-tool-kit lifecycle build:deploy'
}

export const lifecycles = {
   'build:local': BuildLocal,
   'build:ci': BuildCI,
   'build:deploy': BuildDeploy
}
