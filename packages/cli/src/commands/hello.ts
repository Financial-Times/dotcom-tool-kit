import { Task } from '@dotcom-tool-kit/task' // eslint-disable-line object-curly-spacing

export default class Hello extends Task {
  // static description = 'describe the command here'

  //   static examples = [
  //     `$ dotcom-tool-kit hello
  // hello world from ./src/hello.ts!
  // `,
  //   ]

  // static flags = {
  //   help: flags.help({char: 'h'}),
  //   // flag with a value (-n, --name=VALUE)
  //   name: flags.string({char: 'n', description: 'name to print'}),
  //   // flag with no value (-f, --force)
  //   force: flags.boolean({char: 'f'}),
  // }

  // static args = [{name: 'file'}]

  async run(): Promise<void> {
    // const {args, flags} = this.parse(Hello)
    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}
