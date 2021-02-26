"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class HerokuPostbuild extends command_1.Command {
    async runCommand(name) {
        const command = this.config.findCommand(name);
        if (command) {
            const plugin = await command.load();
            return plugin.run();
        }
    }
    async run() {
        await this.runCommand('build:production');
    }
}
exports.default = HerokuPostbuild;
HerokuPostbuild.description = '';
HerokuPostbuild.flags = {};
HerokuPostbuild.args = [];
