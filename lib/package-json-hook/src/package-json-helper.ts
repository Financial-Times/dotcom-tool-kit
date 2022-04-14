import { Hook } from '@dotcom-tool-kit/types'
import type { PackageJson } from '@financial-times/package-json'
import loadPackageJson from '@financial-times/package-json'
import path from 'path'

type PackageJsonConfigField = {
	[key: string]: string
 }

export abstract class PackageJsonHelper extends Hook {
	_packageJson?: PackageJson
	abstract field: string
	abstract key: string
	abstract hook: string

	get packageJson(): PackageJson {
	  if (!this._packageJson) {
		 const filepath = path.resolve(process.cwd(), 'package.json')
		 this._packageJson = loadPackageJson({ filepath })
	  }

	  return this._packageJson
	}

	async check(): Promise<boolean> {
	  const commands = this.packageJson.getField<PackageJsonConfigField>(this.field)
	  return commands?.[this.key]?.includes(this.hook)
	}

	abstract install(): Promise<void>
 }
