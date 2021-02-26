"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const __1 = require("../../");
class Install extends command_1.Command {
    async run() {
        __1.ensureHerokuPostbuildScript();
    }
}
exports.default = Install;
Install.description = '';
Install.flags = {};
Install.args = [];
