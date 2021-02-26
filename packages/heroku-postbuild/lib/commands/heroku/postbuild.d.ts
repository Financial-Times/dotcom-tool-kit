import { Command } from '@oclif/command';
export default class HerokuPostbuild extends Command {
    static description: string;
    static flags: {};
    static args: never[];
    runCommand(name: string): Promise<any>;
    run(): Promise<void>;
}
